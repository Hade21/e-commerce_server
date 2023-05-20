import express from "express";
import {
  createCategory,
  updateCategory,
} from "../controller/productCategoryController";
import { authMiddleware } from "src/middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, createCategory);
router.put("/update/:id", authMiddleware, updateCategory);

export default router;
