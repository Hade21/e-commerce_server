import bcrypt from "bcrypt";
import User from "../model/userModel";
import Cart from "../model/cartModel";
import Product from "../model/productModel";
import Coupon from "../model/couponModel";
import Order from "../model/orderModel"
import { Request, Response } from "express";
import { generateToken, generateRefreshToken } from "../config/jwtToken";
import { verifyRefreshToken } from "../middleware/authMiddleware";
import { CustomRequest, ObjectCartProduct, Payload } from "global";
import { sendEmail } from "./emailController";
import { getCartTotal } from "../utils/productUtils";
import crypto from "crypto";
import uniqid from "uniqid"

//register User
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email, password } = req.body;
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
        .json({ message: "Phone number has taken, please sign in" });
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
        const refreshToken = generateRefreshToken(findUser._id.toString());
        await User.findByIdAndUpdate(
          findUser._id,
          { refreshToken: refreshToken },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "User logged in successfully", data: { _id: findUser._id, token, refreshToken } });
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

//get user detail
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
    return res.status(200).json({ message: "Profile update successfully" });
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
      .json({ message: "User deleted successfully", findUser });
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
    return res.status(200).json({ message: "Blocked successfully", findUser });
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
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "No token attached" });
  const findUser = await User.findOne({ refreshToken });
  if (!findUser) return res.status(401).json({ message: "Token not match" });
  const decoded = verifyRefreshToken(refreshToken);
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
  const { refreshToken } = req.body;
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
    sendEmail(data);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//reset pasword
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

//wishlist
export const getWishlist = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  try {
    const user = await User.findById(id).populate("wishlist");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//add to cart
export const addCart = async (req: CustomRequest, res: Response) => {
  const { cart } = req.body;
  const { id } = req.user as Payload;
  try {
    const user = await User.findById(id);
    const exist = await Cart.findOne({ orderBy: user?.id });
    const productExist = exist?.products.find(
      (item) => item.product?.toString() === cart._id.toString()
    );
    if (exist && productExist) {
      await Cart.updateOne(
        {
          products: { $elemMatch: productExist },
        },
        {
          $set: { "products.$.count": cart.count + productExist.count }
        },
        { new: true }
      );
      const updated = await Cart.findOne({ orderBy: user?._id })
      const product = await Cart.findByIdAndUpdate(updated?._id,
        {
          $set: {
            cartTotal: getCartTotal(updated?.products as ObjectCartProduct[]),
          },
        },
        {
          new: true
        }
      )
      return res
        .status(200)
        .json({ message: "Product added to cart", cart: product });
    } else if (exist && !productExist) {

      let products: ObjectCartProduct = {
        product: undefined,
        count: 0,
        variant: "",
        price: 0,
      };
      products.product = cart._id;
      products.count = cart.count as Number;
      products.variant = cart.variant;
      let getPrice = await Product.findById(cart._id)
        .select("price")
        .exec();
      products.price = getPrice?.price as Number;
      const addCount = await Cart.findByIdAndUpdate(
        exist._id,
        {
          $push: { products: products },
        },
        { new: true }
      );
      const product = await Cart.findByIdAndUpdate(
        exist._id,
        {
          $set: {
            cartTotal: getCartTotal(addCount?.products as ObjectCartProduct[]),
          },
        }, { new: true }
      )
      return res
        .status(200)
        .json({ message: "Product added to cart", cart: product });
    } else {
      const price = await Product.findById(cart._id).select("price").exec()
      const products: ObjectCartProduct[] = [{
        product: cart._id,
        count: cart.count,
        variant: cart.variant,
        price: price!.price
      }]
      const newCart = await new Cart({
        products,
        cartTotal: getCartTotal(products),
        orderBy: user?._id,
      }).save();
      return res.status(201).json({ message: "New Cart added", cart: newCart });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get user cart
export const getCartUser = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" })
    return res.status(200).json(cart);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//empty cart
export const emptyCart = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  try {
    const user = await User.findById(id);
    const cart = await Cart.findOne({ orderBy: id });
    if (user?._id.toString() === cart?.orderBy?.toString()) {
      await Cart.findByIdAndRemove(cart?._id);
      return res.status(200).json({ message: "Cart deleted" });
    }
    return res
      .status(404)
      .json({ message: "Cart not found or unathourized user" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//decrease item in cart
export const decreaseItem = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  const { cart } = req.body;
  try {
    const productCart = await Cart.findOne({ orderBy: id });
    const productExist = productCart?.products.find(
      (item) => item.product?.toString() === cart.product.toString()
    );
    if (!productCart)
      return res.status(404).json({ message: "Cart not found" });
    if (!productExist)
      return res.status(404).json({ message: "Product not found" });
    await Cart.updateOne(
      {
        products: { $elemMatch: productExist },
      },
      {
        $set: {
          "products.$.count": cart.count,
        },
      },
      { new: true }
    );
    const updated = await Cart.findById(productCart._id)
    const decreaseItem = await Cart.findByIdAndUpdate(
      productCart._id,
      {
        $set: { cartTotal: getCartTotal(updated?.products as ObjectCartProduct[]) },
      },
      { new: true }
    )
    return res
      .status(200)
      .json({ message: "Product item updated", decreaseItem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//apply coupon
export const applyCoupon = async (req: CustomRequest, res: Response) => {
  const { coupon } = req.body;
  const { id } = req.user as Payload;
  try {
    const validCoupon = await Coupon.findOne({ code: coupon });

    if (!validCoupon)
      return res
        .status(404)
        .json({ message: "Coupon not found or invalid code" });
    if (!validCoupon.isActive)
      return res.status(203).json({ message: "Coupon is expired" });
    const user = await User.findById(id);
    const cart = await Cart.findOne({ orderBy: user?._id }).populate(
      "products.product"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    let cartTotal = cart.cartTotal;
    let totalAfterDiscount =
      cartTotal! - cartTotal! * (validCoupon.discount / 100);
    await Cart.findOneAndUpdate(
      { orderBy: user?._id },
      { $set: { totalAfterDiscount } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Coupon applied", totalAfterDiscount });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//create order
export const createOrder = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload
  const { COD, appliedCoupon } = req.body
  try {
    if (!COD) return res.status(203).json({ message: "Order failed!" })
    const user = await User.findById(id)
    const userCart = await Cart.findOne({ orderBy: user?._id })
    if (!userCart) return res.status(404).json({ message: "Cart not found" })
    let finalAmount = 0
    if (appliedCoupon && userCart?.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount
    } else {
      finalAmount = userCart?.cartTotal as number
    }
    let newOrder = await new Order({
      products: userCart?.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd"
      },
      orderBy: user?._id,
      orderStatus: "Cash on Delivery"
    }).save()
    let updates = userCart?.products.map(item => {
      return {
        updateOne: {
          filter: { _id: item.product?._id },
          update: { $inc: { stocks: -item?.count!, itemSold: +item?.count! } }
        }
      }
    })
    const updated = await Product.bulkWrite(updates as any, {})
    if (updated) {
      await Cart.findByIdAndDelete(userCart?._id)
    }
    return res.status(201).json({ message: "Order created", newOrder })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

//get orders
export const getOrders = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload
  try {
    const orders = await Order.find({ orderBy: id })
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}

//update order status
export const updateOrderStatus = async (req: CustomRequest, res: Response) => {
  const { status } = req.body
  const { id } = req.params
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status
        }
      },
      {
        new: true
      }
    )
    if (!order) return res.status(404).json({ message: "Order not found" })
    return res.status(200).json({ message: "Order status updated", order })
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}