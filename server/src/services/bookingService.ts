import { bookingRepository } from '../repositories/bookingRepository';
import { roomRepository } from '../repositories/roomRepository';
import { CreateBookingDTO, Booking } from '../types/booking.types';

function diffNights(checkIn: string, checkOut: string): number {
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const ms = outD.getTime() - inD.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export class BookingService {
  async create(userId: string, dto: CreateBookingDTO): Promise<Booking> {
    // Basic validation
    if (!dto.roomId || !dto.checkIn || !dto.checkOut || !dto.guests) {
      throw new Error('Missing booking fields');
    }
    if (dto.checkOut <= dto.checkIn) {
      throw new Error('Check-out must be after check-in');
    }

    // Room + availability
    const room = await roomRepository.findById(dto.roomId);
    if (!room) throw new Error('Room not found');
    if (room.status === 'archived') throw new Error('Room not available');

    const totalUnits = await bookingRepository.countRoomUnits(dto.roomId);
    if (totalUnits <= 0) throw new Error('No units available for this room');

    const overlapping = await bookingRepository.countOverlappingBookings(dto.roomId, dto.checkIn, dto.checkOut);
    if (overlapping >= totalUnits) throw new Error('No availability for selected dates');

    // Price calc
    const nights = diffNights(dto.checkIn, dto.checkOut);
    const totalPrice = nights * Number(room.price);

    return bookingRepository.create(userId, dto.roomId, dto.checkIn, dto.checkOut, dto.guests, totalPrice);
  }

  async createPending(userId: string, dto: CreateBookingDTO) {
    if (!dto.roomId || !dto.checkIn || !dto.checkOut || !dto.guests) {
      throw new Error('Missing booking fields');
    }
    if (dto.checkOut <= dto.checkIn) throw new Error('Check-out must be after check-in');

    const room = await roomRepository.findById(dto.roomId);
    if (!room) throw new Error('Room not found');
    if (room.status === 'archived') throw new Error('Room not available');

    const totalUnits = await bookingRepository.countRoomUnits(dto.roomId);
    if (totalUnits <= 0) throw new Error('No units available for this room');

    const requestedRoomCount = dto.roomCount ?? 1;
    const overlapping = await bookingRepository.countOverlappingBookings(dto.roomId, dto.checkIn, dto.checkOut);
    if ((overlapping + requestedRoomCount) > totalUnits) throw new Error('Not enough rooms available for selected dates');

    const nights = diffNights(dto.checkIn, dto.checkOut);
    const totalPrice = nights * Number(room.price) * requestedRoomCount;

    // 1) Create payment intent with your provider here (placeholder)
    const paymentRef = `pi_${Math.random().toString(36).slice(2)}`; // placeholder reference until you plug a gateway

    // 2) Create pending booking with 15-min expiry
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const booking = await bookingRepository.createPending(
      userId, dto.roomId, dto.checkIn, dto.checkOut, dto.guests, totalPrice, paymentRef, expiresAt, requestedRoomCount
    );

    return { booking, payment: { reference: paymentRef } };
  }

  async confirmByPaymentRef(paymentRef: string) {
    const updated = await bookingRepository.confirmByPaymentRef(paymentRef);
    if (!updated) throw new Error('Booking not found for payment reference');
    return updated;
  }

  async cancelExpiredPendings() {
    return bookingRepository.cancelExpiredPendings(new Date().toISOString());
  }

  async myBookings(userId: string) {
    return bookingRepository.findByUser(userId);
  }

  async cancelBooking(bookingId: string, userId: string) {
    // Verify the booking belongs to the user
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status === 'cancelled') throw new Error('Booking already cancelled');
    
    // Update status to cancelled
    return bookingRepository.updateStatus(bookingId, 'cancelled');
  }

  async listAll() {
    return bookingRepository.findAll();
  }

  async updateStatus(id: string, status: 'pending'|'confirmed'|'cancelled') {
    return bookingRepository.updateStatus(id, status);
  }
}

export const bookingService = new BookingService();