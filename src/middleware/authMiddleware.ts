import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import user from "../model/userModel";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.ACCESS_TOKEN);
      next();
    } catch (error) {
      res
        .status(203)
        .json({ message: "Not Authotized, token expired. PLease login again" });
    }
  } else {
    res.status(203).json({ message: "No token attached" });
  }
};
