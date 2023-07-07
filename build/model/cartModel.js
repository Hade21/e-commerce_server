"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartShema = new mongoose_1.default.Schema({
    products: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
            },
            count: Number,
            variant: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
});
const cartModel = mongoose_1.default.model("cart", cartShema);
exports.default = cartModel;
