import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "global";
import jwt, { Secret } from "jsonwebtoken";
import { Payload } from "global";
import config from "../config/config";
import user from "../model/userModel";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    const SECRET_KEY: Secret = config.ACCESS_TOKEN;
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as Payload;
      (req as CustomRequest).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token, please login again" });
    }
  } else {
    res.status(400).json({ message: "No token attached" });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id } = (req as CustomRequest).user as Payload;
  const findUser = await user.findById({ _id });
  if (findUser?.role !== "admin") {
    return res.status(203).json({ message: "You are not Admin" });
  } else {
    next();
  }
};
