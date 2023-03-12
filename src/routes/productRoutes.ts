import express from "express";
import { createProduct } from "../controller/productController";

const router = express.Router();

router.post("/new", createProduct);

export default router;
