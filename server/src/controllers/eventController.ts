import { Request, Response } from "express";
import { eventRepository } from "../repositories/eventRepository";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// GET all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventRepository.findAll();
    res.json({ ok: true, data: events });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};

// CREATE a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, date, description } = req.body;

    // Validate required fields
    if (!title || !date || !description) {
      return res.status(400).json({ ok: false, error: "All fields are required" });
    }

    // Upload image to Cloudinary if provided
    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'events');
    }

    const newEvent = await eventRepository.create({
      title,
      date,
      description,
      imageUrl,
    });

    res.status(201).json({ ok: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};

// UPDATE an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, description } = req.body;

    // Upload new image to Cloudinary if provided
    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'events');
    }

    const updates: any = {};
    if (title) updates.title = title;
    if (date) updates.date = date;
    if (description) updates.description = description;
    if (imageUrl) updates.imageUrl = imageUrl;

    const updatedEvent = await eventRepository.update(id, updates);

    if (!updatedEvent) {
      return res.status(404).json({ ok: false, error: "Event not found" });
    }

    res.json({ ok: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};

// DELETE an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await eventRepository.delete(id);
    res.json({ ok: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};