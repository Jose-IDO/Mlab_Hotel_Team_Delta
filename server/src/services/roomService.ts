import { Room, RoomPayload } from '../types/room.types';
import { roomRepository } from '../repositories/roomRepository';

export class RoomService {
  async getAllRooms(): Promise<Room[]> {
    return roomRepository.findAll();
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
}

export const roomService = new RoomService();