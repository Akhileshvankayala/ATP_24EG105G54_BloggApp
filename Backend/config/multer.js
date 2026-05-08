import multer from "multer";

/**
 * Multer Configuration
 * Handles incoming file uploads, storing them temporarily in memory
 */
export const upload = multer({
  // Use memory storage to avoid writing temporary files to disk
  storage: multer.memoryStorage(),
  
  // Set limits to prevent large files from consuming too much memory
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit per file
  },
  
  // Filter files to ensure only supported image formats are uploaded
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    
    if (allowedTypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file with a custom error
      const err = new Error("Unsupported file type. Only JPG and PNG are allowed.");
      err.status = 400;
      cb(err, false);
    }
  },
});

