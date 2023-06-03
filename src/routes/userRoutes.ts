import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import {
  blockUser,
  createUser,
  deleteUser,
  forgotPasswordToken,
  getAllUser,
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
router.get("/all-user", authMiddleware, isAdmin, getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:_id", authMiddleware, getUserDetail);
router.get("/wishlist/:id", authMiddleware, getWishlist);
router.put("/updatePassword", authMiddleware, updatePassword);
router.put("/:_id", authMiddleware, updateUser);
router.put("/block-user/:_id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:_id", authMiddleware, isAdmin, unblockUser);
router.put("/address/:id", authMiddleware, updateAddress);
router.delete("/:_id", authMiddleware, deleteUser);
router.delete("/address/:id", authMiddleware, deleteAddress);

export default router;
