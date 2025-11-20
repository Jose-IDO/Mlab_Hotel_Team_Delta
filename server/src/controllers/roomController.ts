import { Request, Response } from 'express';
import { roomService } from '../services/roomService';
import { validateRoomPayload } from '../utils/validators';
import { RoomPayload } from '../types/room.types';

export class RoomController {
  // Get all rooms, optionally filtered by status
  async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as 'active' | 'archived' | undefined;
      const rooms = await roomService.getAllRooms(status);
      res.json({ ok: true, data: rooms });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rooms';
      res.status(500).json({ ok: false, error: errorMessage });
    }
  }

  // Get a room by ID
  async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const room = await roomService.getRoomById(id);

      if (!room) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: room });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to fetch room' });
    }
  }

  // Create a new room
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as Partial<RoomPayload>;

      const validation = validateRoomPayload(body);
      if (!validation.valid) {
        res.status(400).json({ ok: false, error: validation.error });
        return;
      }

      const newRoom = await roomService.createRoom(body as RoomPayload);
      res.status(201).json({ ok: true, data: newRoom });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to create room' });
    }
  }

  // Update a room
  async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body as Partial<RoomPayload>;

      const updatedRoom = await roomService.updateRoom(id, updates);

      if (!updatedRoom) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: updatedRoom });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to update room' });
    }
  }

  // Delete a room
  async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await roomService.deleteRoom(id);

      if (!deleted) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: { message: 'Room deleted successfully' } });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to delete room' });
    }
  }

  // Archive a room
  async archiveRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const archived = await roomService.archiveRoom(id);

      if (!archived) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: archived });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to archive room' });
    }
  }

  // Restore a room
  async restoreRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const restored = await roomService.restoreRoom(id);

      if (!restored) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.json({ ok: true, data: restored });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to restore room' });
    }
  }

  // Fetch reviews for a specific room
  async getRoomReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviews = await roomService.getRoomReviews(id);

      if (!reviews) {
        res.status(404).json({ ok: false, error: 'No reviews found for this room' });
        return;
      }

      res.json({ ok: true, data: reviews });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to fetch room reviews' });
    }
  }

  // Add a review to a room
  async addRoomReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // room ID
      const { name, rating, comment } = req.body;

      if (!name || !rating || !comment) {
        res.status(400).json({ ok: false, error: 'Name, rating, and comment are required' });
        return;
      }

      const newReview = await roomService.addRoomReview(id, { name, rating, comment });
      res.status(201).json({ ok: true, data: newReview });
    } catch (error) {
      console.error('Error adding room review:', error);
      res.status(500).json({ ok: false, error: 'Failed to add room review' });
    }
  }
}

export const roomController = new RoomController();
