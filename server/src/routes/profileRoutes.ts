import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { profileController } from '../controllers/profileController';

const router = Router();

// Update current user's profile
router.patch('/profile', authenticate, (req, res) => profileController.updateProfile(req, res));

// Change current user's password
router.post('/change-password', authenticate, (req, res) => profileController.changePassword(req, res));

export default router;
