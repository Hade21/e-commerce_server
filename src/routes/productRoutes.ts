import express from "express";
import { authMiddleware, isSeller } from "../middleware/authMiddleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetail,
  updateProduct,
} from "../controller/productController";

const router = express.Router();

router.post("/new", authMiddleware, isSeller, createProduct);
router.get("/:_id", getProductDetail);
router.get("/", getAllProducts);
router.put("/:_id", authMiddleware, isSeller, updateProduct);
router.delete("/:_id", authMiddleware, isSeller, deleteProduct);

export default router;
