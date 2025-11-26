import { Request, Response } from 'express';
import { roomService } from '../services/roomService';
import { validateRoomPayload } from '../utils/validators';
import { RoomPayload } from '../types/room.types';
import cloudinary from '../config/cloudinary';
import { roomRepository } from '../repositories/roomRepository';

export class RoomController {
  // Get all rooms, optionally filtered by status
  async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as 'active' | 'archived' | undefined;
      const rooms = await roomService.getAllRooms(status);
      res.json({ ok: true, data: rooms });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to fetch rooms' });
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

  // Upload room images to Cloudinary and save URLs in DB
  async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        res.status(400).json({ ok: false, error: 'No images provided' });
        return;
      }

      if (files.length > 10) {
        res.status(400).json({ ok: false, error: 'Maximum 10 images per upload' });
        return;
      }

      const uploadOne = (file: Express.Multer.File) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `rooms/${id}`,
              resource_type: 'image',
              overwrite: false,
            },
            (error, result) => {
              if (error || !result) return reject(error || new Error('Upload failed'));
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });

      const urls = await Promise.all(files.map(uploadOne));

      const updated = await roomRepository.addImages(id, urls);
      if (!updated) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      res.status(201).json({ ok: true, data: { images: updated.images } });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error?.message || 'Failed to upload images' });
    }
  }

  // Delete image reference from room (and optionally Cloudinary)
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body as { imageUrl?: string };

      if (!imageUrl) {
        res.status(400).json({ ok: false, error: 'imageUrl is required' });
        return;
      }

      // Remove from DB first
      const updated = await roomRepository.removeImage(id, imageUrl);
      if (!updated) {
        res.status(404).json({ ok: false, error: 'Room not found' });
        return;
      }

      // Best-effort Cloudinary delete using public_id derived from URL
      try {
        const match = imageUrl.match(/upload\/v\d+\/(.*)\.(jpg|jpeg|png|webp|gif)$/i);
        if (match && match[1]) {
          const publicId = match[1];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch {
        // ignore cloudinary delete failure
      }

      res.json({ ok: true, data: { images: updated.images } });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error?.message || 'Failed to delete image' });
    }
  }
}

export const roomController = new RoomController();
