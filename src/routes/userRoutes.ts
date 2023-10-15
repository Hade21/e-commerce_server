import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import {
  addCart,
  applyCoupon,
  blockUser,
  createOrder,
  createUser,
  decreaseItem,
  deleteUser,
  emptyCart,
  forgotPasswordToken,
  getAllUser,
  getCartUser,
  getOrders,
  getUserDetail,
  getWishlist,
  handleRefreshToken,
  loginUser,
  logout,
  resetPassword,
  unblockUser,
  updateOrderStatus,
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
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.post("/refresh", handleRefreshToken);
router.get("/cart", authMiddleware, getCartUser);
router.get("/all-user", authMiddleware, isAdmin, getAllUser);
router.get("/logout", logout);
router.get("/:_id", authMiddleware, getUserDetail);
router.get("/wishlist/:id", authMiddleware, getWishlist);
router.get("/cart/orders", authMiddleware, getOrders);
router.put("/cart", authMiddleware, decreaseItem);
router.put("/updatePassword", authMiddleware, updatePassword);
router.put("/:_id", authMiddleware, updateUser);
router.put("/block-user/:_id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:_id", authMiddleware, isAdmin, unblockUser);
router.put("/address/:id", authMiddleware, updateAddress);
router.put("/cart/order/:id", authMiddleware, isAdmin, updateOrderStatus)
router.delete("/cart", authMiddleware, emptyCart);
router.delete("/:_id", authMiddleware, deleteUser);
router.delete("/address/:id", authMiddleware, deleteAddress);

export default router;
