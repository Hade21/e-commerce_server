import sharp from "sharp";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

const multerStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FilenameCallback
  ): void => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

export const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});

export const productImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];
  if (!files) return next();
  await Promise.all(
    files.map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          path.join(__dirname, `../public/images/products/${file.filename}`)
        );
      fs.unlinkSync(__dirname + `/../public/images/products/${file.filename}`);
    })
  );
  next();
};
export const blogImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];
  if (!files) return next();
  await Promise.all(
    files.map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          path.join(__dirname, `../public/images/blogs/${file.filename}`)
        );
      fs.unlinkSync(__dirname + `/../public/images/blogs/${file.filename}`);
    })
  );
  next();
};
