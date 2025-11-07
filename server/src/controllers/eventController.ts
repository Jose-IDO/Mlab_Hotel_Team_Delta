import { Request, Response } from "express";
import { eventRepository } from "../repositories/eventRepository";

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
    const image = req.file?.filename; // undefined if no file uploaded

    // Validate required fields
    if (!title || !date || !description) {
      return res.status(400).json({ ok: false, error: "All fields are required" });
    }

    const newEvent = await eventRepository.create({
      title,
      date,
      description,
      imageUrl: image, // now type is string | undefined, TypeScript happy
    });

    res.status(201).json({ ok: true, data: newEvent });
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