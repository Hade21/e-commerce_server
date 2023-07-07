"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const blogRoute_1 = __importDefault(require("./routes/blogRoute"));
const productCategoryRoute_1 = __importDefault(require("./routes/productCategoryRoute"));
const blogCategoryRoutes_1 = __importDefault(require("./routes/blogCategoryRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const errorHandling_1 = require("./middleware/errorHandling");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function app() {
    const app = (0, express_1.default)();
    const PORT = config_1.default.PORT;
    const MONGO_URI = config_1.default.MONGO_URI;
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(body_parser_1.default.json({ limit: "50mb" }));
    app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use("/api/v1/user", userRoutes_1.default);
    app.use("/api/v1/product", productRoutes_1.default);
    app.use("/api/v1/post", blogRoute_1.default);
    app.use("/api/v1/product-category", productCategoryRoute_1.default);
    app.use("/api/v1/blog-category", blogCategoryRoutes_1.default);
    app.use("/api/v1/brand", brandRoutes_1.default);
    app.use("/api/v1/coupon", couponRoutes_1.default);
    app.use(errorHandling_1.notFound);
    app.use(errorHandling_1.errorMiddleware);
    mongoose_1.default.set("strictQuery", true);
    mongoose_1.default
        .connect(MONGO_URI)
        .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
        .catch((err) => console.log(err));
}
app();
