import Blog from "../model/blogModel";
import User from "../model/userModel";
import { Request, Response } from "express";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const newPost = await Blog.create(req.body);
    return res.status(201).json({ message: "New Post creted", newPost });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBlog = Blog.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "Blog updated", updatedBlog });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
