import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import { User } from '../types/user.types';

const SALT_ROUNDS = 10;

export class ProfileController {
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const authUser = req.user as User | undefined;
      if (!authUser) {
        res.status(401).json({ ok: false, error: 'Not authenticated' });
        return;
      }

      const { firstName, lastName, phone, profileImageUrl, address } = req.body || {};

      // Basic validation of fields (optional, minimal)
      if (firstName !== undefined && typeof firstName !== 'string') {
        res.status(400).json({ ok: false, error: 'Invalid firstName' });
        return;
      }
      if (lastName !== undefined && typeof lastName !== 'string') {
        res.status(400).json({ ok: false, error: 'Invalid lastName' });
        return;
      }
      if (phone !== undefined && typeof phone !== 'string') {
        res.status(400).json({ ok: false, error: 'Invalid phone' });
        return;
      }
      if (profileImageUrl !== undefined && typeof profileImageUrl !== 'string') {
        res.status(400).json({ ok: false, error: 'Invalid profileImageUrl' });
        return;
      }

      // Note: `address` is not persisted in current schema; ignore safely

      const updated = await userRepository.updateProfile(authUser.id, {
        firstName,
        lastName,
        phone,
        profileImageUrl,
      });

      if (!updated) {
        res.status(404).json({ ok: false, error: 'User not found' });
        return;
      }

      res.json({ ok: true, data: { user: updated } });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ ok: false, error: 'Failed to update profile' });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const authUser = req.user as User | undefined;
      if (!authUser) {
        res.status(401).json({ ok: false, error: 'Not authenticated' });
        return;
      }

      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        res.status(400).json({ ok: false, error: 'Current and new password are required' });
        return;
      }

      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        res.status(400).json({ ok: false, error: 'Password must be at least 8 characters' });
        return;
      }

      const existingHash = await userRepository.getPasswordHashById(authUser.id);
      if (!existingHash) {
        res.status(404).json({ ok: false, error: 'User not found' });
        return;
      }

      const valid = await bcrypt.compare(currentPassword, existingHash);
      if (!valid) {
        res.status(401).json({ ok: false, error: 'Current password is incorrect' });
        return;
      }

      const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await userRepository.updatePasswordHash(authUser.id, newHash);

      res.json({ ok: true, data: { message: 'Password changed successfully' } });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ ok: false, error: 'Failed to change password' });
    }
  }
}

export const profileController = new ProfileController();
