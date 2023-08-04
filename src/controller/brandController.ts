import Brand from "../model/brandModel";
import { Request, Response } from "express";

//create new brand
export const createBrand = async (req: Request, res: Response) => {
  try {
    const newBrand = await Brand.create(req.body);
    return res.status(201).json({ message: "New Brand created", newBrand });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("E11000")) return res.status(409).json({ message: "Brand already exist" })
      return res.status(500).json({ message: "Something went wrong", error });
    }
  }
};
//update brand
export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand)
      return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Brand updated", updatedBrand });
  } catch (error) {
    return res.status(500).json({ message: "someething went wrong" });
  }
};

//get all brand
export const getAllBrand = async (req: Request, res: Response) => {
  try {
    const allBrand = await Brand.find();
    if (!allBrand) return res.status(404).json({ message: "No brand found" });
    return res.status(200).json({ message: "Found", brand: allBrand });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get single brand
export const getSingleBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Found", brand });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete brand
export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Brand.findByIdAndDelete(id);
    return res.status(200).json({ message: "Brand deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
