import express from "express";
import { createUser } from "../controller/authController";

const route = express.Router();

route.post("/register", createUser);

export default route;
