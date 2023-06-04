import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import {
  addCart,
  applyCoupon,
  blockUser,
  createUser,
  decreaseItem,
  deleteUser,
  emptyCart,
  forgotPasswordToken,
  getAllUser,
  getCartUser,
  getUserDetail,
  getWishlist,
  handleRefreshToken,
  loginUser,
  logout,
  resetPassword,
  unblockUser,
  updatePassword,
  updateUser,
} from "../controller/userController";
import {
  deleteAddress,
  saveAddress,
  updateAddress,
} from "../controller/addressController";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/reset-password/:token", resetPassword);
router.post("/address", authMiddleware, saveAddress);
router.post("/cart", authMiddleware, addCart);
router.post("/apply-coupon", authMiddleware, applyCoupon);
router.get("/all-user", authMiddleware, isAdmin, getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:_id", authMiddleware, getUserDetail);
router.get("/wishlist/:id", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getCartUser);
router.put("/updatePassword", authMiddleware, updatePassword);
router.put("/:_id", authMiddleware, updateUser);
router.put("/block-user/:_id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:_id", authMiddleware, isAdmin, unblockUser);
router.put("/address/:id", authMiddleware, updateAddress);
router.put("/cart", authMiddleware, decreaseItem);
router.delete("/:_id", authMiddleware, deleteUser);
router.delete("/address/:id", authMiddleware, deleteAddress);
router.delete("/cart", authMiddleware, emptyCart);

export default router;
