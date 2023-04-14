import express from "express";
import { createBlog } from "../controller/blogController";

const router = express.Router();

router.post("/new", createBlog);

export default router;
