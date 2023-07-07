"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadFile_1 = require("../middleware/uploadFile");
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
router.post("/new", authMiddleware_1.authMiddleware, authMiddleware_1.isSeller, productController_1.createProduct);
router.get("/:_id", productController_1.getProductDetail);
router.get("/", productController_1.getAllProducts);
router.put("/wishlist", authMiddleware_1.authMiddleware, productController_1.addToWishlist);
router.put("/rating", authMiddleware_1.authMiddleware, productController_1.ratings);
router.put("/:_id", authMiddleware_1.authMiddleware, authMiddleware_1.isSeller, productController_1.updateProduct);
router.delete("/:_id", authMiddleware_1.authMiddleware, authMiddleware_1.isSeller, productController_1.deleteProduct);
router.put("/uploads/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isSeller, uploadFile_1.uploadPhoto.array("images", 10), uploadFile_1.productImgResize, productController_1.uploadImages);
exports.default = router;
