import { Request } from "express";

declare global {
  namespace NodeJS {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
  }
}

export interface Payload {
  id: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: string | Payload;
}
