"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogShema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numViews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isDisliked: { type: Boolean, default: false },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
    dislikes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" }],
    images: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5DFGqY1xEkoJUpvPRy2ISAIjvAUBvbPHnDQ&usqp=CAU",
    },
    author: {
        type: String,
        default: "Admin",
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
const Blog = mongoose_1.default.model("Blog", blogShema);
exports.default = Blog;
