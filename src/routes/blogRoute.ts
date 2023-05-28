import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlog,
  getBlogById,
  likeBlog,
  updateBlog,
  uploadBlogImages,
} from "../controller/blogController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { productImgResize, uploadPhoto } from "../middleware/uploadFile";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/like/:id", authMiddleware, likeBlog);
router.put("/dislike/:id", authMiddleware, dislikeBlog);
router.put(
  "/uploads/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 1),
  productImgResize,
  uploadBlogImages
);

export default router;
