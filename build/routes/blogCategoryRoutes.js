"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogCategoryController_1 = require("../controller/blogCategoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, blogCategoryController_1.createCategory);
router.put("/:id", authMiddleware_1.authMiddleware, blogCategoryController_1.updateCategory);
router.get("/", authMiddleware_1.authMiddleware, blogCategoryController_1.getAllCategory);
router.get("/:id", authMiddleware_1.authMiddleware, blogCategoryController_1.getSingleCategory);
router.delete("/:id", authMiddleware_1.authMiddleware, blogCategoryController_1.deleteCategory);
exports.default = router;
