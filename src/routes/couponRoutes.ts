import express from "express";
import { createCoupon, getAllCoupon } from "../controller/couponController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupon);

export default router;
