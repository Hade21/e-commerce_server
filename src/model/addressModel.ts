import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  postalCode: { type: Number, required: true },
  details: { type: String, required: true },
  note: String,
});

const addressModel = mongoose.model("address", addressSchema);

export default addressModel;
