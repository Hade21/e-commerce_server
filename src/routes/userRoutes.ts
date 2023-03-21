import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import {
  blockUser,
  createUser,
  deleteUser,
  getAllUser,
  getUserDetail,
  handleRefreshToken,
  loginUser,
  logout,
  unblockUser,
  updateUser,
} from "../controller/userController";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-user", authMiddleware, isAdmin, getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:_id", authMiddleware, getUserDetail);
router.put("/:_id", authMiddleware, updateUser);
router.put("/block-user/:_id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:_id", authMiddleware, isAdmin, unblockUser);
router.delete("/:_id", authMiddleware, deleteUser);

export default router;
