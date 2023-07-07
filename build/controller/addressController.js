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
exports.deleteAddress = exports.updateAddress = exports.saveAddress = void 0;
const addressModel_1 = __importDefault(require("../model/addressModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
//save new address
const saveAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const newAddress = yield addressModel_1.default.create(req.body);
        const updateAddress = yield userModel_1.default.findByIdAndUpdate(id, { $push: { address: newAddress._id } }, { new: true }).populate("address");
        return res.status(201).json({ message: "Address saved", updateAddress });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.saveAddress = saveAddress;
//update address
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: uID } = req.user;
    const { id: aID } = req.params;
    try {
        const owner = yield userModel_1.default.findById(uID);
        if (!owner)
            return res.status(404).json({ message: "User not found!" });
        const exist = owner.address.find((item) => item._id.toString() === aID.toString());
        if (exist) {
            const updateAddress = yield addressModel_1.default.findByIdAndUpdate(aID, req.body, {
                new: true,
            });
            return res
                .status(200)
                .json({ message: "Address updated successfully", updateAddress });
        }
        return res.status(404).json({ message: "Address not found" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateAddress = updateAddress;
//delete address
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: uID } = req.user;
    const { id: aID } = req.params;
    try {
        const owner = yield userModel_1.default.findById(uID);
        if (!owner)
            return res.status(404).json({ message: "User not found!" });
        const exist = owner.address.find((item) => item._id.toString() === aID.toString());
        if (exist) {
            const deleteAddress = yield addressModel_1.default.findByIdAndDelete(aID);
            const updateUser = yield userModel_1.default.findByIdAndUpdate(uID, { $pull: { address: aID } }, { new: true }).populate("address");
            return res
                .status(200)
                .json({ message: "Address deleted succesfully", updateUser });
        }
        return res.status(404).json({ message: "Address not found" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteAddress = deleteAddress;
