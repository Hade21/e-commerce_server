import express from "express";
import {
  createCategory,
  getAllCategory,
  updateCategory,
} from "../controller/blogCategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, createCategory);
router.put("/update/:id", authMiddleware, updateCategory);
router.get("/", authMiddleware, getAllCategory);

export default router;
