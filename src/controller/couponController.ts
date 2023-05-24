import Coupon from "../model/couponModel";
import { Request, Response } from "express";
import { couponGenerator } from "../middleware/couponGenerator";

//create coupon
export const createCoupon = async (req: Request, res: Response) => {
  const { discount, expiry } = req.body;
  try {
    let isExist = false;
    let code = "";
    do {
      code = couponGenerator();
      const exist = await Coupon.findOne({ code });
      if (exist) {
        isExist = true;
      }
    } while (isExist);
    const newCoupon = await Coupon.create({ code, discount, expiry });
    return res
      .status(201)
      .json({ message: "Coupon created successfully", newCoupon });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

//get all coupon
export const getAllCoupon = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({ message: "Found", coupons });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete coupon
export const deleteCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon)
      return res.status(404).json({ message: "Coupon not found" });
    return res
      .status(200)
      .json({ message: "Coupon deleted successfully", deletedCoupon });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
