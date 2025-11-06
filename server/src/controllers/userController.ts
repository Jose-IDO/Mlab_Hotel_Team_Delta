import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';

export class UserController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string) || undefined;
      const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 100);
      const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
      const offset = (page - 1) * limit;

      const users = await userRepository.findAll(search, limit, offset);

      res.json({ ok: true, data: { users, page, limit } });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ ok: false, error: 'Failed to fetch users' });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ ok: false, error: 'User ID is required' });
        return;
      }

      await userRepository.updateIsActive(id, false);
      const user = await userRepository.findById(id);

      res.json({ ok: true, data: { user } });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({ ok: false, error: 'Failed to deactivate user' });
    }
  }

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ ok: false, error: 'User ID is required' });
        return;
      }

      await userRepository.updateIsActive(id, true);
      const user = await userRepository.findById(id);

      res.json({ ok: true, data: { user } });
    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({ ok: false, error: 'Failed to activate user' });
    }
  }

  async listAdmins(req: Request, res: Response): Promise<void> {
    try {
      const admins = await userRepository.findAdmins();
      res.json({ ok: true, data: { admins } });
    } catch (error) {
      console.error('List admins error:', error);
      res.status(500).json({ ok: false, error: 'Failed to fetch administrators' });
    }
  }
}

export const userController = new UserController();
