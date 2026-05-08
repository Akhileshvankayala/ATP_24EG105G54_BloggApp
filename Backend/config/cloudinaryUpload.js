import cloudinary from "./cloudinary.js";

/**
 * Utility: uploadToCloudinary
 * Purpose: Converts a file buffer into a stream and uploads it to Cloudinary
 * @param {Buffer} buffer - The image data buffer from Multer
 * @returns {Promise} - Resolves with the Cloudinary upload result or rejects with an error
 */
export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream to pipe the buffer directly to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_users" }, // Destination folder in Cloudinary
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
    
    // Write the buffer to the stream and signal completion
    stream.end(buffer);
  });
};

