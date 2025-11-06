import { RoomPayload } from '../types/room.types';

export const validateRoomPayload = (body: Partial<RoomPayload>): { valid: boolean; error?: string } => {
  if (!body.roomName || typeof body.roomName !== 'string') {
    return { valid: false, error: 'roomName is required and must be a string' };
  }

  if (!body.roomType || typeof body.roomType !== 'string') {
    return { valid: false, error: 'roomType is required and must be a string' };
  }

  if (typeof body.price !== 'number' || body.price < 0) {
    return { valid: false, error: 'price is required and must be a positive number' };
  }

  if (body.maxGuests && (typeof body.maxGuests !== 'number' || body.maxGuests < 1)) {
    return { valid: false, error: 'maxGuests must be at least 1' };
  }

  if (body.numberOfBeds && (typeof body.numberOfBeds !== 'number' || body.numberOfBeds < 1)) {
    return { valid: false, error: 'numberOfBeds must be at least 1' };
  }

  if (body.roomSizeSqm && (typeof body.roomSizeSqm !== 'number' || body.roomSizeSqm < 0)) {
    return { valid: false, error: 'roomSizeSqm must be a positive number' };
  }

  return { valid: true };
};