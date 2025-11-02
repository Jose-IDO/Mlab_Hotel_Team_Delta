import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { hotelSettingsController } from '../controllers/hotelSettingsController';

const router = Router();

// Public route - get hotel settings
router.get('/public', hotelSettingsController.getPublic);

// Admin route - update hotel settings
router.put('/', authenticate, requireRole(['super_admin', 'hotel_manager']), hotelSettingsController.update);

export default router;
