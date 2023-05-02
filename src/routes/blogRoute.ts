import express from "express";
import { createBlog, updateBlog } from "../controller/blogController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/new", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);

export default router;
