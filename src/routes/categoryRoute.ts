import express from "express";
import { createCategory } from "../controller/categoryController";

const router = express.Router();

router.post("/new", createCategory);

export default router;
