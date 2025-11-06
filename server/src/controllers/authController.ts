import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { RegisterPayload, LoginPayload } from '../types/user.types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as RegisterPayload;

      // Validate required fields
      if (!payload.email || !payload.password || !payload.firstName || !payload.lastName) {
        res.status(400).json({ 
          ok: false, 
          error: 'Email, password, first name, and last name are required' 
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(payload.email)) {
        res.status(400).json({ 
          ok: false, 
          error: 'Invalid email format' 
        });
        return;
      }

      const result = await authService.register(payload);
      
      res.status(201).json({ 
        ok: true, 
        data: result 
      });
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({ ok: false, error: error.message });
      } else if (error.message.includes('Password must')) {
        res.status(400).json({ ok: false, error: error.message });
      } else {
        res.status(500).json({ ok: false, error: 'Failed to register user' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as LoginPayload;

      // Validate required fields
      if (!payload.email || !payload.password) {
        res.status(400).json({ 
          ok: false, 
          error: 'Email and password are required' 
        });
        return;
      }

      const result = await authService.login(payload);
      
      res.json({ 
        ok: true, 
        data: result 
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid email or password') || 
          error.message.includes('deactivated')) {
        res.status(401).json({ ok: false, error: error.message });
      } else {
        res.status(500).json({ ok: false, error: 'Failed to login' });
      }
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by auth middleware
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({ ok: false, error: 'Not authenticated' });
        return;
      }

      res.json({ ok: true, data: user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ ok: false, error: 'Failed to get user info' });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(400).json({ ok: false, error: 'Token is required' });
        return;
      }

      const user = await authService.getUserFromToken(token);
      
      if (!user) {
        res.status(401).json({ ok: false, error: 'Invalid token' });
        return;
      }

      res.json({ ok: true, data: { valid: true, user } });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(401).json({ ok: false, error: 'Invalid or expired token' });
    }
  }
}

export const authController = new AuthController();
