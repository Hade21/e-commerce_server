import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import {
  blockUser,
  createUser,
  deleteUser,
  getAllUser,
  getUserDetail,
  loginUser,
  unblockUser,
  updateUser,
} from "../controller/userController";

const route = express.Router();

route.post("/register", createUser);
route.post("/login", loginUser);
route.get("/all-user", authMiddleware, isAdmin, getAllUser);
route.get("/:id", authMiddleware, getUserDetail);
route.put("/:id", authMiddleware, updateUser);
route.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
route.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
route.delete("/:id", authMiddleware, deleteUser);

export default route;
