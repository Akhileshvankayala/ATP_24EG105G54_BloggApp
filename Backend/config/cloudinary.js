import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Configuration
 * Sets up the connection to Cloudinary using environment variables for image management
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

