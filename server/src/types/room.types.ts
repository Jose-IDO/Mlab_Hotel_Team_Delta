export interface Unit {
  unitNumber: string;
}

export interface RoomPayload {
  roomName: string;
  roomType: string;
  price: number;
  maxGuests: number;
  bedType: string;
  numberOfBeds: number;
  roomSizeSqm: number;
  amenities: string[];
  units: Unit[];
}

export interface Room extends RoomPayload {
  id: string;
  status?: 'active' | 'archived';
  images?: string[]; // Array of Cloudinary URLs
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}