import express from "express";
import { authMiddleware } from "src/middleware/authMiddleware";
import {
  createUser,
  deleteUser,
  getUserDetail,
  loginUser,
  updateUser,
} from "../controller/userController";

const route = express.Router();

route.post("/register", createUser);
route.post("/login", loginUser);
route.get("/user/:id", authMiddleware, getUserDetail);
route.put("/user:id", authMiddleware, updateUser);
route.delete("/user/:id", authMiddleware, deleteUser);

export default route;
