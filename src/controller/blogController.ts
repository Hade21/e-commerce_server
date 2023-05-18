import { CustomRequest, Payload } from "global";
import Blog from "../model/blogModel";
import User from "../model/userModel";
import { Request, Response } from "express";

//create post
export const createBlog = async (req: Request, res: Response) => {
  try {
    const newPost = await Blog.create(req.body);
    return res.status(201).json({ message: "New Post creted", newPost });
  } catch (error) {
    return res.status(400).json(error);
  }
};
//update post
export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "Blog updated", updatedBlog });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//get all post
export const getAllBlog = async (req: Request, res: Response) => {
  try {
    const posts = await Blog.find();
    if (posts.length === 0)
      return res.status(404).json({ message: "No post found" });
    return res.status(200).json({ message: "Article found", posts });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//get post by id
export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Blog.findById(id);
    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      { numViews: post!.numViews + 1 },
      { new: true }
    )
      .populate("likes")
      .populate("dislikes");
    return res.status(200).json({ message: "Article found", updatedPost });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//delete post
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    return res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//like post
export const likeBlog = async (req: CustomRequest, res: Response) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findById(blogId);
  const { id: loginUserId } = req.user as Payload;
  const isLiked = blog?.isLiked;

  const alreadyDisliked = blog?.dislikes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  } else if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  }
};
//dislike post
export const dislikeBlog = async (req: CustomRequest, res: Response) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findById(blogId);
  const { id: loginUserId } = req.user as Payload;
  const isDisliked = blog?.isDisliked;

  const alreadyLiked = blog?.likes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  } else if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    return res.status(200).json({ blog });
  }
};
