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
exports.uploadImages = exports.ratings = exports.addToWishlist = exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.getProductDetail = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_1 = require("../utils/cloudinary");
const fs_1 = __importDefault(require("fs"));
//create product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.title)
            req.body.slug = (0, slugify_1.default)(req.body.title, {
                lower: true,
                strict: true,
                locale: "id",
            });
        const newItem = yield productModel_1.default.create(req.body);
        return res
            .status(201)
            .json({ message: "Product created succesfully", product: newItem });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createProduct = createProduct;
//get product detail
const getProductDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const findProduct = yield productModel_1.default.findById(_id);
        if (!findProduct)
            return res.sendStatus(404);
        return res
            .status(200)
            .json({ message: "Product found", item: findProduct });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getProductDetail = getProductDetail;
//get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //filtering
        const queryObj = Object.assign({}, req.query);
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = productModel_1.default.find(JSON.parse(queryStr));
        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.toString().split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort("-createdAt");
        }
        //limiting fields
        if (req.query.fields) {
            const fields = req.query.fields.toString().split(",").join(" ");
            query = query.select(fields);
        }
        else {
            query = query.select("-__v");
        }
        //pagination
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numProducts = yield productModel_1.default.countDocuments();
            if (skip >= numProducts)
                return res.status(200).json({ message: "No more products" });
        }
        const products = yield query;
        return res.status(200).json({ message: "Product found", items: products });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllProducts = getAllProducts;
//update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        if (req.body.title)
            req.body.slug = (0, slugify_1.default)(req.body.title, {
                lower: true,
                strict: true,
                locale: "id",
            });
        const updateProduct = yield productModel_1.default.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        if (!updateProduct)
            return res.status(404).json({ message: "Product not found" });
        return res
            .status(200)
            .json({ message: "Product updated successfully", updateProduct });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateProduct = updateProduct;
//delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const deletedProduct = yield productModel_1.default.findByIdAndDelete(_id);
        if (!deletedProduct)
            return res.status(404).json({ message: "Product not found" });
        return res
            .status(200)
            .json({ message: "Product deleted successfully", deletedProduct });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteProduct = deleteProduct;
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: uID } = req.user;
    const { id: prodID } = req.body;
    try {
        const user = yield userModel_1.default.findById(uID);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isAdded = user.wishlist.find((item) => item.toString() === prodID.toString());
        if (isAdded) {
            const removeWishlist = yield userModel_1.default.findByIdAndUpdate(uID, { $pull: { wishlist: prodID } }, { new: true });
            return res
                .status(200)
                .json({ message: "Product removed from wishlist", removeWishlist });
        }
        else {
            const addWishlist = yield userModel_1.default.findByIdAndUpdate(uID, { $push: { wishlist: prodID } }, { new: true }).populate("wishlist");
            return res
                .status(200)
                .json({ message: "Product added to wishlist", addWishlist });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.addToWishlist = addToWishlist;
const ratings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: uID } = req.user;
    const { star, comment, id: prodID } = req.body;
    try {
        let message = "";
        const product = yield productModel_1.default.findById(prodID);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        const isRated = product.ratings.find((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.postedBy) === null || _a === void 0 ? void 0 : _a.toString()) === uID.toString(); });
        if (isRated) {
            yield productModel_1.default.updateOne({
                ratings: { $elemMatch: isRated },
            }, { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }, { new: true });
            message = "Product rating updated";
        }
        else {
            yield productModel_1.default.findByIdAndUpdate(prodID, { $push: { ratings: { star, postedBy: uID, comment } } }, { new: true });
            message = "Product rated";
        }
        const getAllRatings = yield productModel_1.default.findById(prodID).select("ratings");
        const totalRating = getAllRatings === null || getAllRatings === void 0 ? void 0 : getAllRatings.ratings.length;
        let ratingSum = getAllRatings === null || getAllRatings === void 0 ? void 0 : getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let avgRating = Math.round(ratingSum / totalRating);
        const ratedProduct = yield productModel_1.default.findByIdAndUpdate(prodID, { totalRating: avgRating }, { new: true });
        return res.status(200).json({ message, ratedProduct });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.ratings = ratings;
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const uploader = (path) => (0, cloudinary_1.cloudinaryUploadImage)(path);
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = yield uploader(path);
            urls.push(newPath);
            fs_1.default.unlinkSync(path);
        }
        const product = yield productModel_1.default.findByIdAndUpdate(id, {
            images: urls.map((item) => {
                return { url: item };
            }),
        }, { new: true });
        return res.status(200).json({ message: "Images uploaded", product });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.uploadImages = uploadImages;
