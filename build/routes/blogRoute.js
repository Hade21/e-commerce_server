"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controller/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadFile_1 = require("../middleware/uploadFile");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, blogController_1.createBlog);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, blogController_1.updateBlog);
router.get("/", blogController_1.getAllBlog);
router.get("/:id", blogController_1.getBlogById);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, blogController_1.deleteBlog);
router.put("/like/:id", authMiddleware_1.authMiddleware, blogController_1.likeBlog);
router.put("/dislike/:id", authMiddleware_1.authMiddleware, blogController_1.dislikeBlog);
router.put("/uploads/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, uploadFile_1.uploadPhoto.array("images", 1), uploadFile_1.productImgResize, blogController_1.uploadBlogImages);
exports.default = router;
