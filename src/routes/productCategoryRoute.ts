import express from "express";
import { createCategory } from "../controller/productCategoryController";

const router = express.Router();

router.post("/new", createCategory);

export default router;
