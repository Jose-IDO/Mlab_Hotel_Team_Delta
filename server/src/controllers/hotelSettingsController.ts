import { Request, Response } from 'express';
import { hotelSettingsRepository } from '../repositories/hotelSettingsRepository';

export const hotelSettingsController = {
  // Public endpoint - anyone can view hotel settings
  getPublic: async (_req: Request, res: Response) => {
    try {
      const settings = await hotelSettingsRepository.get();
      res.json({ ok: true, data: settings });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  },

  // Admin endpoint - update hotel settings
  update: async (req: Request, res: Response) => {
    try {
      const updated = await hotelSettingsRepository.update(req.body);
      res.json({ ok: true, data: updated });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },
};
