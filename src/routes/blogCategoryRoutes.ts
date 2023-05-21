import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controller/blogCategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.get("/", authMiddleware, getAllCategory);
router.get("/:id", authMiddleware, getSingleCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
