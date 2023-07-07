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
exports.blogImgResize = exports.productImgResize = exports.uploadPhoto = void 0;
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new Error("Not an image! Please upload only images."));
    }
};
exports.uploadPhoto = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
});
const productImgResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files)
        return next();
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path_1.default.join(__dirname, `../public/images/products/${file.filename}`));
        fs_1.default.unlinkSync(__dirname + `/../public/images/products/${file.filename}`);
    })));
    next();
});
exports.productImgResize = productImgResize;
const blogImgResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files)
        return next();
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path_1.default.join(__dirname, `../public/images/blogs/${file.filename}`));
        fs_1.default.unlinkSync(__dirname + `/../public/images/blogs/${file.filename}`);
    })));
    next();
});
exports.blogImgResize = blogImgResize;
