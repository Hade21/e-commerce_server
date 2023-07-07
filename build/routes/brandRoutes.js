"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brandController_1 = require("../controller/brandController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, brandController_1.createBrand);
router.put("/:id", authMiddleware_1.authMiddleware, brandController_1.updateBrand);
router.get("/", authMiddleware_1.authMiddleware, brandController_1.getAllBrand);
router.get("/:id", authMiddleware_1.authMiddleware, brandController_1.getSingleBrand);
router.delete("/:id", authMiddleware_1.authMiddleware, brandController_1.deleteBrand);
exports.default = router;
