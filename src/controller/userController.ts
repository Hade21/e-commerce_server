import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userModel as User } from "../model/userModel";
import { generateToken, generateRefereshToken } from "../config/jwtToken";
import { verifyRefreshToken } from "../middleware/authMiddleware";
import { CustomRequest, Payload } from "global";
import { sendEmail } from "./emailController";
import crypto from "crypto";

//register User
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email } = req.body;
  const password = await bcrypt.hash(req.body.password, 12);
  const emailExist = await User.findOne({ email });
  const phoneExist = await User.findOne({ phone });
  try {
    if (!emailExist && !phoneExist) {
      const newUser = await User.create({
        firstName,
        lastName,
        phone,
        email,
        password,
      });
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } else if (emailExist) {
      return res
        .status(422)
        .json({ message: "Email has taken, please sign in" });
    } else {
      return res
        .status(422)
        .json({ message: "Phone number has taken, please siign in" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

//login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  try {
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        const token = generateToken(findUser._id.toString());
        const refreshToken = generateRefereshToken(findUser._id.toString());
        const updateUser = await User.findByIdAndUpdate(
          findUser._id,
          { refreshToken: refreshToken },
          { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res
          .status(200)
          .json({ message: "User logged in successfully", token });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//get All User
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get User detail
export const getUserDetail = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await User.findById({ _id });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User found", user: findUser });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

//update User
export const updateUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const { firstName, lastName, phone, email, role } = req.body;
    const findUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Profile update succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await User.findByIdAndDelete({ _id });
    return res
      .status(200)
      .json({ message: "User deleted succesfully", findUser });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//block user
export const blockUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    console.log(findUser);
    return res.status(200).json({ message: "Blocked succesfully", findUser });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//unblock user
export const unblockUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await User.findByIdAndUpdate(
      _id,
      { isBlocked: false },
      { new: true }
    );
    return res.status(200).json({ message: "Unblock successfully", findUser });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//handle refresh token
export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    return res.status(400).json({ message: "No token attached" });
  const findUser = await User.findOne({ refreshToken: cookie.refreshToken });
  if (!findUser) return res.status(401).json({ message: "Token not match" });
  const decoded = verifyRefreshToken(cookie.refreshToken);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "Something error with refresh token" });
  } else {
    const accessToken = generateToken(decoded.id);
    return res.status(200).json({ accessToken });
  }
};

//logout
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(400).json({ message: "No token attached" });
  const findUser = await User.findOne({ refreshToken });
  if (!findUser) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "User logged out" });
};

//update password
export const updatePassword = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  const { newPassword, confirmPassword } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Password not match" });
  } else {
    user!.password = newPassword;
    const updatedPassword = user?.save();
    return res
      .status(200)
      .json({ message: "Password updated successfully", updatedPassword });
  }
};

//forgot password
export const forgotPasswordToken = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  try {
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now <a href='http:localhost/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      subject: "Reset Password Link",
      html: resetURL,
      text: `Hey ${user.lastName}, if you didn't request this password reset just ignore this email`,
    };
    // sendEmail(data);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;
  const token: string = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(401).json({ message: "Token expired, please try again" });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Password didn't match" });
  user.password = newPassword;
  (user.passwordResetToken = undefined),
    (user.passwordResetExpires = undefined);
  await user.save();
  res.status(200).json({ message: "Password updated succesfully" });
};
