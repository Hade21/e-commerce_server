"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productCategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});
const ProductCategory = mongoose_1.default.model("ProductCategory", productCategorySchema);
exports.default = ProductCategory;
