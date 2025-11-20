import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { User, Role } from '../types/user.types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ ok: false, error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await authService.getUserFromToken(token);

    if (!user) {
      res.status(401).json({ ok: false, error: 'Invalid or expired token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ ok: false, error: 'Authentication failed' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ ok: false, error: 'Not authenticated' });
      return;
    }

    const userRoles = user.roles?.map((r: Role) => r.name) || [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({ 
        ok: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await authService.getUserFromToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};
