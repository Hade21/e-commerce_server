import express from "express";
import {
  createUser,
  getUserDetail,
  loginUser,
} from "../controller/authController";

const route = express.Router();

route.post("/register", createUser);
route.post("/login", loginUser);
route.get("/user/:id", getUserDetail);

export default route;
