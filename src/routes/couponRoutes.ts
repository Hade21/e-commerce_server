import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
} from "../controller/couponController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

export default router;
