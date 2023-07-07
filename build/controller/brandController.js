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
exports.deleteBrand = exports.getSingleBrand = exports.getAllBrand = exports.updateBrand = exports.createBrand = void 0;
const brandModel_1 = __importDefault(require("../model/brandModel"));
//create new brand
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBrand = yield brandModel_1.default.create(req.body);
        return res.status(201).json({ message: "New Brand created", newBrand });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createBrand = createBrand;
//update brand
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedBrand = yield brandModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedBrand)
            return res.status(404).json({ message: "Brand not found" });
        return res.status(200).json({ message: "Brand updated", updatedBrand });
    }
    catch (error) {
        return res.status(500).json({ message: "someething went wrong" });
    }
});
exports.updateBrand = updateBrand;
//get all brand
const getAllBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBrand = yield brandModel_1.default.find();
        if (!allBrand)
            return res.status(404).json({ message: "No brand found" });
        return res.status(200).json({ message: "Found", brand: allBrand });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllBrand = getAllBrand;
//get single brand
const getSingleBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const brand = yield brandModel_1.default.findById(id);
        if (!brand)
            return res.status(404).json({ message: "Brand not found" });
        return res.status(200).json({ message: "Found", brand });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getSingleBrand = getSingleBrand;
//delete brand
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield brandModel_1.default.findByIdAndDelete(id);
        return res.status(200).json({ message: "Brand deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteBrand = deleteBrand;
