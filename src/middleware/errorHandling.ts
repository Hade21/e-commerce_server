import { NextFunction, Request, Response } from "express";

interface HttpException extends Error {
  status: number;
  message: string;
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({ message: "URL not found" });
  next(error);
};

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error?.message });
};

export { notFound, errorMiddleware };
