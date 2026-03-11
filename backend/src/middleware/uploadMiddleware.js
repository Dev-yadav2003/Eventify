import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve("uploads", "events");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeExtension = extension || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image uploads are allowed."));
};

export const uploadEventImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("imageFile");
