"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefereshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.default.ACCESS_TOKEN, {
        expiresIn: "1h",
        algorithm: "HS256",
    });
};
exports.generateToken = generateToken;
const generateRefereshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.default.REFRESH_TOKEN, {
        expiresIn: "1d",
        algorithm: "HS256",
    });
};
exports.generateRefereshToken = generateRefereshToken;
