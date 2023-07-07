"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const getConfig = () => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        MONGO_URI: process.env.MONGO_URI,
        ACCESS_TOKEN: process.env.ACCESS_TOKEN,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN,
        MAIL_ID: process.env.MAIL_ID,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
    };
};
const getSanitizedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Environment variable ${key} is not set`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);
exports.default = sanitizedConfig;
