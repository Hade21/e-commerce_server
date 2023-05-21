import BlogCategory from "../model/blogCategoryModel";
import { Request, Response } from "express";

//create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    return res
      .status(201)
      .json({ message: "New Category created", newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "Category", updatedCategory });
  } catch (error) {
    return res.status(500).json({ message: "someething went wrong" });
  }
};

//get all category
export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const allCategory = await BlogCategory.find();
    return res.status(200).json(allCategory);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await BlogCategory.findByIdAndDelete(id);
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
