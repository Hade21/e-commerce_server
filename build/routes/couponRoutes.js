"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controller/couponController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, couponController_1.createCoupon);
router.get("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, couponController_1.getAllCoupon);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, couponController_1.updateCoupon);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, couponController_1.deleteCoupon);
exports.default = router;
