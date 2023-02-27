import mongoose from "mongoose";

export const validateID = (id: mongoose.Types.ObjectId | string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("This id is not valid or not found");
  }
};
