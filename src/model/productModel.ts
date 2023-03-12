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
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      enum: ["Samsung", "Apple", "Lenovo"],
    },
    stocks: Number,
    itemSold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: ["Black", "Red", "Brown"],
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
