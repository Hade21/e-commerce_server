"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.getAllCoupon = exports.createCoupon = void 0;
const couponModel_1 = __importDefault(require("../model/couponModel"));
const couponGenerator_1 = require("../middleware/couponGenerator");
//create coupon
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discount, expiry } = req.body;
    try {
        let isExist = false;
        let code = "";
        do {
            code = (0, couponGenerator_1.couponGenerator)();
            const exist = yield couponModel_1.default.findOne({ code });
            if (exist) {
                isExist = true;
            }
        } while (isExist);
        const newCoupon = yield couponModel_1.default.create({ code, discount, expiry });
        return res
            .status(201)
            .json({ message: "Coupon created successfully", newCoupon });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});
exports.createCoupon = createCoupon;
//get all coupon
const getAllCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield couponModel_1.default.find();
        return res.status(200).json({ message: "Found", coupons });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllCoupon = getAllCoupon;
//update coupon
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedCoupon = couponModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCoupon)
            return res.status(404).json({ message: "Coupon not found" });
        return res.status(200).json({ message: "Coupon updated", updatedCoupon });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateCoupon = updateCoupon;
//delete coupon
const deleteCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedCoupon = yield couponModel_1.default.findByIdAndDelete(id);
        if (!deletedCoupon)
            return res.status(404).json({ message: "Coupon not found" });
        return res
            .status(200)
            .json({ message: "Coupon deleted successfully", deletedCoupon });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteCoupon = deleteCoupon;
