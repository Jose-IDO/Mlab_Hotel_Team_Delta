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

  // Admin availability for a date range (default current month)
  availability: async (req: Request, res: Response) => {
    try {
      const start = (req.query.start as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
      const end = (req.query.end as string) || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0,10);
      const fmt = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      // Fetch active rooms with unit counts
      const rooms = await roomRepository.findAll('active');
      const roomUnits: Record<string, number> = {};
      rooms.forEach(r => { roomUnits[r.id] = (r.units?.length || 0); });

      // Fetch bookings overlapping range
      const bookings = await bookingRepository.findInRange(start, end);

      // Build list of all dates from start to end inclusive
      const dates: string[] = [];
      {
        const s = new Date(start);
        const e = new Date(end);
        for (let d = new Date(s.getFullYear(), s.getMonth(), s.getDate()); d <= e; d.setDate(d.getDate() + 1)) {
          dates.push(fmt(d));
        }
      }

      // Initialize map: for each room, for each date, status 'available'
      const result = rooms.map(r => ({
        roomId: r.id,
        roomName: r.roomName,
        roomType: r.roomType,
        totalUnits: roomUnits[r.id] || 0,
        dates: {} as Record<string, 'available' | 'booked'>,
      }));
      const byRoom: Record<string, typeof result[number]> = Object.fromEntries(result.map(r => [r.roomId, r]));

      dates.forEach(date => {
        result.forEach(r => { r.dates[date] = 'available'; });
      });

      // For each booking, mark covered nights as 'booked' when occupancy reaches full
      // We'll tally occupancy per room per date
      const occ: Record<string, Record<string, number>> = {};
      bookings.forEach(b => {
        if (!occ[b.roomId]) occ[b.roomId] = {};
        const ci = new Date(b.checkIn);
        const co = new Date(b.checkOut);
        // Nights from ci to co - 1 day
        for (let d = new Date(ci.getFullYear(), ci.getMonth(), ci.getDate()); d < co; d.setDate(d.getDate() + 1)) {
          const day = fmt(d);
          // Only within requested range
          if (day < dates[0] || day > dates[dates.length-1]) continue;
          occ[b.roomId][day] = (occ[b.roomId][day] || 0) + (b.roomCount || 1);
        }
      });

      // Compare occ to totalUnits to set status
      Object.entries(occ).forEach(([roomId, map]) => {
        const total = roomUnits[roomId] || 0;
        const target = byRoom[roomId];
        if (!target) return;
        Object.entries(map).forEach(([day, count]) => {
          if (total > 0 && count >= total) {
            target.dates[day] = 'booked';
          }
        });
      });

      return res.json({ ok: true, data: result, range: { start, end } });
    } catch (e: any) {
      return res.status(400).json({ ok: false, error: e.message });
    }
  }
};