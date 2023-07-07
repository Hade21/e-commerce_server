"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFound = void 0;
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404).json({ message: "URL not found" });
    next(error);
};
exports.notFound = notFound;
const errorMiddleware = (error, req, res, next) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error === null || error === void 0 ? void 0 : error.message });
};
exports.errorMiddleware = errorMiddleware;
