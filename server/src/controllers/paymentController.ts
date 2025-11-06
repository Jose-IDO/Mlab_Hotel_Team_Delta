import { Request, Response } from 'express';
import { paymentRepository } from '../repositories/paymentRepository';

export const paymentController = {
  // Get payment by ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await paymentRepository.findById(id);
      if (!payment) return res.status(404).json({ ok: false, error: 'Payment not found' });
      res.json({ ok: true, data: payment });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  // Get payments for a booking
  getByBookingId: async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      const payments = await paymentRepository.findByBookingId(bookingId);
      res.json({ ok: true, data: payments });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  // Get user's payment history
  myPayments: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      const payments = await paymentRepository.findByUserId(userId);
      res.json({ ok: true, data: payments });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  // Admin: Get all payments
  listAll: async (_req: Request, res: Response) => {
    try {
      const payments = await paymentRepository.findAll();
      res.json({ ok: true, data: payments });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },
};
