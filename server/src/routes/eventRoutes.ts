import express from "express";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController";
import { upload } from "../config/upload";

const router = express.Router();

// Routes
router.get("/", getAllEvents);
router.post("/", upload.single("image"), createEvent);
router.put("/:id", upload.single("image"), updateEvent);
router.delete("/:id", deleteEvent);

export default router;