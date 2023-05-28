import express from "express";
import { authMiddleware, isSeller } from "../middleware/authMiddleware";
import { uploadPhoto, productImgResize } from "../middleware/uploadFile";
import {
  addToWishlist,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetail,
  ratings,
  updateProduct,
  uploadImages,
} from "../controller/productController";

const router = express.Router();

router.post("/new", authMiddleware, isSeller, createProduct);
router.get("/:_id", getProductDetail);
router.get("/", getAllProducts);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, ratings);
router.put("/:_id", authMiddleware, isSeller, updateProduct);
router.delete("/:_id", authMiddleware, isSeller, deleteProduct);
router.put(
  "/uploads/:id",
  authMiddleware,
  isSeller,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

export default router;
