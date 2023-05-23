import express from "express";
import { createCoupon } from "../controller/couponController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);

export default router;
