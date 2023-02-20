import mongoose from "mongoose";
import config from "./config";

const MONGO_URI = config.MONGO_URI;

export const dbConnect = () => {
  console.log(MONGO_URI);
};
