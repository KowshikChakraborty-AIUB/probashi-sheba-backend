import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import * as fs from "fs";

import path from "path";
import { v4 as uuidv4 } from 'uuid';
import AppError from "../errors/AppError";

// Set up AWS configuration
const region = "ap-south-1";
const endpoint = "https://blr1.digitaloceanspaces.com";
const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: "DO003NGNH3Z8U72AGPHW",
    secretAccessKey: "y05jtj5lb1CGu9XxZMCYVggZSTNhaQuukluw+AuCuME",
  },
});

const SpaceName = "cit-node";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const ImageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage =
      /png|jpg|webp|jpeg|gif|PNG|JPG|WEBP|JPEG|GIF|pdf|PDF/; // Added gif and GIF
    const extension = path.extname(file.originalname);

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a png|jpg|webp|jpeg|gif image"));
    }
  },
  limits: {
    fileSize: 5000000, // 5MB limit
  },
});

// Function to determine content type based on file extension
const getContentType = (filename: string) => {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".WEBP":
      return "image/WEBP";
    case ".PNG":
      return "image/PNG";
    case ".JPG":
      return "image/JPG";
    case ".JPEG":
      return "image/JPEG";
    case ".GIF":
      return "image/GIF";
    case ".pdf":
      return "application/pdf";
    case ".PDF":
      return "application/PDF";
    default:
      return "application/octet-stream";
  }
};

// Upload image to DigitalOcean Spaces
const uploadToSpaces = async (file: any) => {
  const fileStream = fs.createReadStream(file.path);
  const contentType = getContentType(file.filename);

  const uploadParams = {
    Bucket: SpaceName,
    Key: `probashi_sheba_app_image/${file.filename}`,
    Body: fileStream,
    ACL: "public-read" as ObjectCannedACL,
    ContentType: contentType,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    const { Bucket, Key } = uploadParams;
    const Location = `https://cit-node.blr1.cdn.digitaloceanspaces.com/${Key}`;
    // const Location = `https://blr1.digitaloceanspaces.com/${Bucket}/${Key}`;
    const sendData = {
      Location,
      Key,
    };
    // Normalize the file path to ensure cross-platform compatibility
    const normalizedPath = path.normalize(file.path);
    fs.unlinkSync(normalizedPath);
    if (httpStatusCode == 200) return sendData;
    else throw new AppError(400, "Image upload failed");
  } catch (error) {
    throw error;
  }
};

const deleteFromSpaces = async (key: any) => {
  const deleteParams = {
    Bucket: SpaceName,
    Key: key,
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(deleteParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    if (httpStatusCode == 204) return true;
    else throw new AppError(400, "Image Delete failed");
  } catch (error) {
    throw error;
  }
};

// Initialize multer with the storage settings
const VideoUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedVideo = /mp4/;
    const extension = path.extname(file.originalname);

    // Check if the file extension is mp4
    if (supportedVideo.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be an MP4 video"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

const VideoUploader = async (file: any) => {
  const fileStream = fs.createReadStream(file.path); // Assuming file is a multer file object

  const uploadParams = {
    Bucket: SpaceName,
    Key: `probashi_sheba_app_video/${file.filename}`,
    Body: fileStream,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    const { Bucket, Key } = uploadParams;
    const Location = `https://cit-node.blr1.cdn.digitaloceanspaces.com/${Key}`;
    fs.unlinkSync(file.path);
    const sendData = {
      Location,
      Key,
    };
    if (httpStatusCode == 200) return sendData;
    else throw new AppError(400, "Image upload failed");
  } catch (error) {
    throw error; // Rethrow the error to handle it further up the call stack
  }
};

export const FileUploadHelper = {
  ImageUpload,
  uploadToSpaces,
  deleteFromSpaces,
  VideoUploader,
  VideoUpload,
};