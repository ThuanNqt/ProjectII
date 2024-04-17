import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: "dyxycz0xe",
  api_key: "188182885992526",
  api_secret: "gDtvEMWDtPxRga5jJVqNzhgWOdM",
});

type UploadStreamFunction = (req: Request) => Promise<any>;

const streamUpload: UploadStreamFunction = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

export const upload = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const uploadAsync = async (req: Request) => {
      try {
        const result = await streamUpload(req);
        console.log(result.secure_url);
        req.body[req.file.fieldname] = result.secure_url;
        next();
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to upload image" });
      }
    };
    uploadAsync(req);
  } else {
    next();
  }
};
