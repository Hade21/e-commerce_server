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
exports.isSeller = exports.verifyRefreshToken = exports.isAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const userModel_1 = __importDefault(require("../model/userModel"));
const authMiddleware = (req, res, next) => {
    var _a, _b;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1];
        const SECRET_KEY = config_1.default.ACCESS_TOKEN;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Invalid token, please login again" });
        }
    }
    else {
        res.status(400).json({ message: "No token attached" });
    }
};
exports.authMiddleware = authMiddleware;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: _id } = req.user;
    const findUser = yield userModel_1.default.findById({ _id });
    if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) !== "admin") {
        return res.status(203).json({ message: "You are not Admin" });
    }
    else {
        next();
    }
});
exports.isAdmin = isAdmin;
const verifyRefreshToken = (token) => {
    const secretKey = config_1.default.REFRESH_TOKEN;
    const decoded = jsonwebtoken_1.default.verify(token, secretKey);
    return decoded;
};
exports.verifyRefreshToken = verifyRefreshToken;
const isSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: _id } = req.user;
    const findUser = yield userModel_1.default.findById({ _id });
    if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) === "user") {
        return res
            .status(203)
            .json({ message: "You are not allowed to change product" });
    }
    else {
        next();
    }
});
exports.isSeller = isSeller;
