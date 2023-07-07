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
exports.deleteCategory = exports.getSingleCategory = exports.getAllCategory = exports.updateCategory = exports.createCategory = void 0;
const productCategoryModel_1 = __importDefault(require("../model/productCategoryModel"));
//create new category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = yield productCategoryModel_1.default.create(req.body);
        return res
            .status(201)
            .json({ message: "New Category created", newCategory });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createCategory = createCategory;
//update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedCategory = yield productCategoryModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory)
            return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ message: "Category", updatedCategory });
    }
    catch (error) {
        return res.status(500).json({ message: "someething went wrong" });
    }
});
exports.updateCategory = updateCategory;
//get all category
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCategory = yield productCategoryModel_1.default.find();
        if (!allCategory)
            return res.status(404).json({ message: "No category found" });
        return res
            .status(200)
            .json({ message: "All Category", categories: allCategory });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllCategory = getAllCategory;
//get single category
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield productCategoryModel_1.default.findById(id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        return res.status(200).json({ message: "Found", category });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getSingleCategory = getSingleCategory;
//delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield productCategoryModel_1.default.findByIdAndDelete(id);
        return res.status(200).json({ message: "Category deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteCategory = deleteCategory;
