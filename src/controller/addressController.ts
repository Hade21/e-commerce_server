import { CustomRequest, Payload } from "global";
import Address from "../model/addressModel";
import User from "../model/userModel";
import { Request, Response } from "express";

//save new address
export const saveAddress = async (req: CustomRequest, res: Response) => {
  const { id } = req.user as Payload;
  try {
    const newAddress = await Address.create(req.body);
    const updateAddress = await User.findByIdAndUpdate(
      id,
      { $push: { address: newAddress._id } },
      { new: true }
    ).populate("address");
    return res.status(201).json({ message: "Address saved", updateAddress });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//update address
export const updateAddress = async (req: CustomRequest, res: Response) => {
  const { id: uID } = req.user as Payload;
  const { id: aID } = req.params;
  try {
    const owner = await User.findById(uID);
    if (!owner) return res.status(404).json({ message: "User not found!" });
    const exist = owner.address.find(
      (item) => item._id.toString() === aID.toString()
    );
    if (exist) {
      const updateAddress = await Address.findByIdAndUpdate(aID, req.body, {
        new: true,
      });
      return res
        .status(200)
        .json({ message: "Address updated successfully", updateAddress });
    }
    return res.status(404).json({ message: "Address not found" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
