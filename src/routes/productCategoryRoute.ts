import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controller/productCategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, createCategory);
router.put("/update/:id", authMiddleware, updateCategory);
router.get("/", authMiddleware, getAllCategory);
router.get("/:id", authMiddleware, getSingleCategory);
router.delete("/delete/:id", authMiddleware, deleteCategory);

export default router;
