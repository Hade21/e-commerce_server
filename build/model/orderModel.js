"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    products: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
            },
            count: Number,
            variant: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not processed",
        enum: [
            "Not processed",
            "Cash on Delivery",
            "Processed",
            "Canceled",
            "Delivered",
            "Dispatched",
        ],
    },
    orderBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
}, {
    timestamps: true,
});
const orderModel = mongoose_1.default.model("order", orderSchema);
exports.default = orderModel;
