"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controller/userController");
const addressController_1 = require("../controller/addressController");
const router = express_1.default.Router();
router.post("/register", userController_1.createUser);
router.post("/login", userController_1.loginUser);
router.post("/forgot-password-token", userController_1.forgotPasswordToken);
router.post("/reset-password/:token", userController_1.resetPassword);
router.post("/address", authMiddleware_1.authMiddleware, addressController_1.saveAddress);
router.post("/cart", authMiddleware_1.authMiddleware, userController_1.addCart);
router.post("/cart/apply-coupon", authMiddleware_1.authMiddleware, userController_1.applyCoupon);
router.post("/cart/create-order", authMiddleware_1.authMiddleware, userController_1.createOrder);
router.get("/cart", authMiddleware_1.authMiddleware, userController_1.getCartUser);
router.get("/all-user", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.getAllUser);
router.get("/refresh", userController_1.handleRefreshToken);
router.get("/logout", userController_1.logout);
router.get("/:_id", authMiddleware_1.authMiddleware, userController_1.getUserDetail);
router.get("/wishlist/:id", authMiddleware_1.authMiddleware, userController_1.getWishlist);
router.get("/cart/orders", authMiddleware_1.authMiddleware, userController_1.getOrders);
router.put("/cart", authMiddleware_1.authMiddleware, userController_1.decreaseItem);
router.put("/updatePassword", authMiddleware_1.authMiddleware, userController_1.updatePassword);
router.put("/:_id", authMiddleware_1.authMiddleware, userController_1.updateUser);
router.put("/block-user/:_id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.blockUser);
router.put("/unblock-user/:_id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.unblockUser);
router.put("/address/:id", authMiddleware_1.authMiddleware, addressController_1.updateAddress);
router.put("/cart/order/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.updateOrderStatus);
router.delete("/cart", authMiddleware_1.authMiddleware, userController_1.emptyCart);
router.delete("/:_id", authMiddleware_1.authMiddleware, userController_1.deleteUser);
router.delete("/address/:id", authMiddleware_1.authMiddleware, addressController_1.deleteAddress);
exports.default = router;