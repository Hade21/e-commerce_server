import Category from "../model/categoryModel";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await Category.create(req.body);
    return res
      .status(201)
      .json({ message: "New Category created", newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
