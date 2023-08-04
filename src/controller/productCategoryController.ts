import ProductCategory from "../model/productCategoryModel";
import { Request, Response } from "express";

//create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await ProductCategory.create(req.body);
    return res
      .status(201)
      .json({ message: "New Category created", newCategory });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("E11000")) return res.status(409).json({ message: "Brand already exist" })
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

//update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ message: "Category", updatedCategory });
  } catch (error) {
    return res.status(500).json({ message: "someething went wrong" });
  }
};

//get all category
export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const allCategory = await ProductCategory.find();
    if (!allCategory)
      return res.status(404).json({ message: "No category found" });
    return res
      .status(200)
      .json({ message: "All Category", categories: allCategory });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get single category
export const getSingleCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await ProductCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ message: "Found", category });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await ProductCategory.findById(id);
  if (!category) return res.status(404).json({ message: "Category not found" })
  try {
    await ProductCategory.findByIdAndDelete(id);
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
