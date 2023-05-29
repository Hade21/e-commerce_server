import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", function (next) {
  let currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) this.createdAt = currentDate;
  if (this.expiry < currentDate) this.isActive = false;
  next();
});

const Coupon = mongoose.model("coupons", couponSchema);

export default Coupon;
