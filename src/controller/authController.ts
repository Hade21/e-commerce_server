import { Request, Response } from "express";
import user from "../model/userModel";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email } = req.body;
  const password = await bcrypt.hash(req.body.password, 12);
  const findUser = await user.findOne({ email });
  try {
    if (!findUser) {
      const newUser = user.create({
        firstName,
        lastName,
        phone,
        email,
        password,
      });
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(422).json({ message: "User already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "User not created" });
  }
};
