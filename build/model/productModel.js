"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        lowercase: true,
    },
    stocks: {
        type: Number,
        required: true,
    },
    itemSold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true,
    },
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
        },
    ],
    totalRating: {
        type: String,
        default: 0,
    },
}, {
    timestamps: true,
});
const productModel = mongoose_1.default.model("product", productSchema);
exports.default = productModel;
