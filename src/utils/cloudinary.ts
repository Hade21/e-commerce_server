import cloudinary from "cloudinary";
import config from "../config/config";

cloudinary.v2.config({
  cloud_name: config.API_KEY,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});

export const uploadImage = async (image: any) => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "ecommerce",
    });
    return result;
  } catch (err) {
    return err;
  }
};
