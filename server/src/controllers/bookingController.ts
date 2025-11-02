import { Request, Response } from 'express';
import { bookingService } from '../services/bookingService';
import { bookingRepository } from '../repositories/bookingRepository';
import { roomRepository } from '../repositories/roomRepository';

export const bookingController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const result = await bookingService.createPending(userId, req.body);
      res.status(201).json({ ok: true, data: result });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  myBookings: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const bookings = await bookingService.myBookings(userId);
      res.json({ ok: true, data: bookings });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  getByReference: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { reference } = req.params;
      
      const booking = await bookingRepository.findByPaymentReference(reference);
      if (!booking) {
        return res.status(404).json({ ok: false, error: 'Booking not found' });
      }

      // Verify the booking belongs to the current user
      if (booking.userId !== userId) {
        return res.status(403).json({ ok: false, error: 'Access denied' });
      }

      // Get room details for additional info
      const room = await roomRepository.findById(booking.roomId);

      res.json({ 
        ok: true, 
        booking: {
          ...booking,
          roomType: room?.roomType || 'Room',
          hotelName: 'Delta Hotel',
        }
      });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  cancelBooking: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const cancelled = await bookingService.cancelBooking(id, userId);
      if (!cancelled) return res.status(404).json({ ok: false, error: 'Booking not found or cannot be cancelled' });
      res.json({ ok: true, data: cancelled });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  listAll: async (_req: Request, res: Response) => {
    try {
      const bookings = await bookingService.listAll();
      res.json({ ok: true, data: bookings });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: 'pending'|'confirmed'|'cancelled' };
      const updated = await bookingService.updateStatus(id, status);
      if (!updated) return res.status(404).json({ ok: false, error: 'Not found' });
      res.json({ ok: true, data: updated });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },
};