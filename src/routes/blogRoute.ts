import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlog,
  getBlogById,
  likeBlog,
  updateBlog,
} from "../controller/blogController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/like/:id", authMiddleware, likeBlog);
router.put("/dislike/:id", authMiddleware, dislikeBlog);

export default router;
