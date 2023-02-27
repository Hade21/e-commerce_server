import { Request, Response } from "express";
import bcrypt from "bcrypt";
import user from "../model/userModel";
import { generateToken } from "../config/jwtToken";

//register User
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email } = req.body;
  const password = await bcrypt.hash(req.body.password, 12);
  const findUser = await user.findOne({ email });
  try {
    if (!findUser) {
      const newUser = await user.create({
        firstName,
        lastName,
        phone,
        email,
        password,
      });
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } else {
      res.status(422).json({ message: "User already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const findUser = await user.findOne({ email });
  try {
    if (!findUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        const token = generateToken(findUser._id.toString());
        res.status(200).json({ message: "User logged in successfully", token });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//get All User
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//get User detail
export const getUserDetail = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await user.findById({ _id });
    if (!findUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User found", user: findUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//update User
export const updateUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const { firstName, lastName, phone, email } = req.body;
    const password = await bcrypt.hash(req.body.password, 12);
    const findUser = await user.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        phone,
        password,
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Profile update succesfully", user: findUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await user.findByIdAndDelete({ _id });
    res.status(200).json({ message: "User deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//block user
export const blockUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await user.findByIdAndUpdate(
      _id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.status(200).json({ message: "Blocked succesfully", findUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//unblock user
export const unblockUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findUser = await user.findByIdAndUpdate(
      _id,
      { isBlocked: false },
      { new: true }
    );
    res.status(200).json({ message: "Unblock successfully", findUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
