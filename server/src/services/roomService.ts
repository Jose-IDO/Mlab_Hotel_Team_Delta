import { Room, RoomPayload } from '../types/room.types';
import { roomRepository } from '../repositories/roomRepository';

export class RoomService {
  async getAllRooms(status?: 'active' | 'archived'): Promise<Room[]> {
    return roomRepository.findAll(status);
  }

  async getRoomById(id: string): Promise<Room | undefined> {
    return roomRepository.findById(id);
  }

  async createRoom(payload: RoomPayload): Promise<Room> {
    return roomRepository.create(payload);
  }

  async updateRoom(id: string, updates: Partial<RoomPayload>): Promise<Room | null> {
    return roomRepository.update(id, updates);
  }

  async deleteRoom(id: string): Promise<boolean> {
    return roomRepository.delete(id);
  }

  async archiveRoom(id: string): Promise<Room | null> {
    return roomRepository.archive(id);
  }

  async restoreRoom(id: string): Promise<Room | null> {
    return roomRepository.restore(id);
  }
}

export const roomService = new RoomService();