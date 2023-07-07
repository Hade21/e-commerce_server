"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true });
couponSchema.pre("save", function (next) {
    let currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    if (this.expiry < currentDate)
        this.isActive = false;
    next();
});
const Coupon = mongoose_1.default.model("coupons", couponSchema);
exports.default = Coupon;
