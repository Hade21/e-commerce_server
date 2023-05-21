import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config/config";
import userRoute from "./routes/userRoutes";
import productRoute from "./routes/productRoutes";
import blogRoute from "./routes/blogRoute";
import productCategoryRoute from "./routes/productCategoryRoute";
import blogCategoryRoute from "./routes/blogCategoryRoutes";
import { errorMiddleware, notFound } from "./middleware/errorHandling";
import helmet from "helmet";
import cookieParser from "cookie-parser";

function app() {
  const app = express();
  const PORT: number = config.PORT;
  const MONGO_URI: string = config.MONGO_URI;

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/product", productRoute);
  app.use("/api/v1/post", blogRoute);
  app.use("/api/v1/product-category", productCategoryRoute);
  app.use("/api/v1/blog-category", blogCategoryRoute);

  app.use(notFound);
  app.use(errorMiddleware);

  mongoose.set("strictQuery", true);
  mongoose
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
