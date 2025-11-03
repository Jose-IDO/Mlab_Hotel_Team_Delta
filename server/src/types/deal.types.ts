export interface DealPayload {
  roomId: string;
  title: string;
  description?: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface Deal extends DealPayload {
  id: number;
  createdAt: Date;
}

export interface DealWithRoom extends Deal {
  roomName: string;
  roomType: string;
  originalPrice: number;
  discountedPrice: number;
  images?: string[];
  maxGuests: number;
  bedType: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}
