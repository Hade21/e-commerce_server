import { Request } from "express";
import mongoose from "mongoose";

export interface Payload {
  id: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: string | Payload;
}

export interface IData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface ObjectCartProduct {
  product: mongoose.Types.ObjectId | undefined;
  count: Number | undefined;
  variant: String | undefined;
  price: Number | undefined;
}
