import jwt from "jsonwebtoken";
import config from "./config";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, config.ACCESS_TOKEN, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};
