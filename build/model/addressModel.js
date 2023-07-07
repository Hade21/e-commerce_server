"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: Number, required: true },
    details: { type: String, required: true },
    note: String,
});
const addressModel = mongoose_1.default.model("address", addressSchema);
exports.default = addressModel;
