import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    brand: {
      type: String,
      require: true,
      lowercase: true,
    },
    stocks: {
      type: Number,
      require: true,
    },
    itemSold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      require: true,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
