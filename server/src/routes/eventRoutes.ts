import express, { Request } from "express";
import { getAllEvents, createEvent, deleteEvent } from "../controllers/eventController";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Optional: filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

// Routes
router.get("/", getAllEvents);
router.post("/", upload.single("image"), createEvent);
router.delete("/:id", deleteEvent);

export default router;
