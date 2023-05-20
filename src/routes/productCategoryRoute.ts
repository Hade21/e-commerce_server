import express from "express";
import {
  createCategory,
  getAllCategory,
  updateCategory,
} from "../controller/productCategoryController";
import { authMiddleware } from "src/middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, createCategory);
router.put("/update/:id", authMiddleware, updateCategory);
router.get("/", authMiddleware, getAllCategory);

export default router;
