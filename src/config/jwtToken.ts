import jwt from "jsonwebtoken";
import config from "./config";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, config.ACCESS_TOKEN, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};

export const generateRefereshToken = (id: string) => {
  return jwt.sign({ id }, config.REFRESH_TOKEN, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
};
