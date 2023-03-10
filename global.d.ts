import { Request } from "express";

export interface Payload {
  id: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: string | Payload;
}
