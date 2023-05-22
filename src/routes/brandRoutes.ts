import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
} from "../controller/brandController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.get("/", authMiddleware, getAllBrand);
router.get("/:id", authMiddleware, getSingleBrand);
router.delete("/:id", authMiddleware, deleteBrand);

export default router;
