import { Request, Response } from 'express';
import { dealRepository } from '../repositories/dealRepository';
import { DealPayload } from '../types/deal.types';

export const dealController = {
  // Get all deals (admin)
  async getAllDeals(req: Request, res: Response) {
    try {
      const deals = await dealRepository.getAllDeals();
      res.json({ ok: true, data: deals });
    } catch (error: any) {
      console.error('Error fetching all deals:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Get active deals (public)
  async getActiveDeals(req: Request, res: Response) {
    try {
      const deals = await dealRepository.getActiveDeals();
      res.json({ ok: true, data: deals });
    } catch (error: any) {
      console.error('Error fetching active deals:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Get deal by ID
  async getDealById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid deal ID' });
      }

      const deal = await dealRepository.getDealById(id);
      if (!deal) {
        return res.status(404).json({ ok: false, error: 'Deal not found' });
      }

      res.json({ ok: true, data: deal });
    } catch (error: any) {
      console.error('Error fetching deal:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Create new deal
  async createDeal(req: Request, res: Response) {
    try {
      const { roomId, title, description, discountPercentage, startDate, endDate, isActive } = req.body;

      // Validation
      if (!roomId || !title || discountPercentage === undefined || !startDate || !endDate) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Missing required fields: roomId, title, discountPercentage, startDate, endDate' 
        });
      }

      if (discountPercentage < 0 || discountPercentage > 100) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Discount percentage must be between 0 and 100' 
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({ 
          ok: false, 
          error: 'End date must be after start date' 
        });
      }

      const payload: DealPayload = {
        roomId,
        title,
        description,
        discountPercentage,
        startDate: start,
        endDate: end,
        isActive: isActive !== undefined ? isActive : true
      };

      const deal = await dealRepository.createDeal(payload);
      res.status(201).json({ ok: true, data: deal });
    } catch (error: any) {
      console.error('Error creating deal:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Update deal
  async updateDeal(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid deal ID' });
      }

      const { roomId, title, description, discountPercentage, startDate, endDate, isActive } = req.body;

      // Validation for discount percentage if provided
      if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Discount percentage must be between 0 and 100' 
        });
      }

      // Validation for dates if both provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
          return res.status(400).json({ 
            ok: false, 
            error: 'End date must be after start date' 
          });
        }
      }

      const payload: Partial<DealPayload> = {};
      if (roomId !== undefined) payload.roomId = roomId;
      if (title !== undefined) payload.title = title;
      if (description !== undefined) payload.description = description;
      if (discountPercentage !== undefined) payload.discountPercentage = discountPercentage;
      if (startDate !== undefined) payload.startDate = new Date(startDate);
      if (endDate !== undefined) payload.endDate = new Date(endDate);
      if (isActive !== undefined) payload.isActive = isActive;

      const deal = await dealRepository.updateDeal(id, payload);
      if (!deal) {
        return res.status(404).json({ ok: false, error: 'Deal not found' });
      }

      res.json({ ok: true, data: deal });
    } catch (error: any) {
      console.error('Error updating deal:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Toggle deal active status
  async toggleDealActive(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid deal ID' });
      }

      const deal = await dealRepository.toggleDealActive(id);
      if (!deal) {
        return res.status(404).json({ ok: false, error: 'Deal not found' });
      }

      res.json({ ok: true, data: deal });
    } catch (error: any) {
      console.error('Error toggling deal status:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  // Delete deal
  async deleteDeal(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid deal ID' });
      }

      const success = await dealRepository.deleteDeal(id);
      if (!success) {
        return res.status(404).json({ ok: false, error: 'Deal not found' });
      }

      res.json({ ok: true, message: 'Deal deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      res.status(500).json({ ok: false, error: error.message });
    }
  }
};
