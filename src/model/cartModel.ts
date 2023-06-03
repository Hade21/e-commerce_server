import mongoose from "mongoose";

const cartShema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      count: Number,
      variant: String,
      price: Number,
    },
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const cartModel = mongoose.model("cart", cartShema);

export default cartModel;
