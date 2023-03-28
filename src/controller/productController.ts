import Product from "../model/productModel";
import { Request, Response } from "express";
import slugify from "slugify";

//create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (req.body.title)
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        locale: "id",
      });
    const newItem = await Product.create(req.body);
    return res
      .status(201)
      .json({ message: "Product created succesfully", product: newItem });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get product detail
export const getProductDetail = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const findProduct = await Product.findById(_id);
    if (!findProduct) return res.sendStatus(404);
    return res
      .status(200)
      .json({ message: "Product found", item: findProduct });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.toString().split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.toString().split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    //pagination
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numProducts = await Product.countDocuments();
      if (skip >= numProducts)
        return res.status(200).json({ message: "No more products" });
    }

    const products = await query;
    return res.status(200).json({ message: "Product found", items: products });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//update product
export const updateProduct = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    if (req.body.title)
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        locale: "id",
      });
    const updateProduct = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!updateProduct)
      return res.status(404).json({ message: "Product not found" });
    return res
      .status(200)
      .json({ message: "Product updated successfully", updateProduct });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//delete product
export const deleteProduct = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    return res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};