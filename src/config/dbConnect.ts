import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/DB_NAME";

const dbConnecct = () => {
  try {
    const connect = mongoose.connect(MONGODB_URI);
  } catch (err) {
    if (err instanceof mongoose.Error) {
      throw new Error(err.message);
    }
  }
};
