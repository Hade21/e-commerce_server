import { Request } from "express";

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
