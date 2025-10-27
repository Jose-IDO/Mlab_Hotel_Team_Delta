import { Request, Response } from 'express';
import { roomService } from '../services/roomService';
import { validateRoomPayload } from '../utils/validators';
import { RoomPayload } from '../types/room.types';

export class RoomController {
  async getAllRooms(_req: Request, res: Response): Promise<void> {
    try {
      const rooms = await roomService.getAllRooms();
      res.json({ ok: true, data: rooms });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to fetch rooms' });
    }
  }

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

  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as Partial<RoomPayload>;

      // Validate payload
      const validation = validateRoomPayload(body);
      if (!validation.valid) {
        res.status(400).json({ ok: false, error: validation.error });
        return;
      }

      // Create room
      const newRoom = await roomService.createRoom(body as RoomPayload);
      res.status(201).json({ ok: true, data: newRoom });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to create room' });
    }
  }

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
}

export const roomController = new RoomController();