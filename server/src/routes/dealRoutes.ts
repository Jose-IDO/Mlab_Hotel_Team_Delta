import { Router } from 'express';
import { dealController } from '../controllers/dealController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/active', dealController.getActiveDeals);

// Protected admin routes
router.get('/', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.getAllDeals);
router.get('/:id', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.getDealById);
router.post('/', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.createDeal);
router.put('/:id', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.updateDeal);
router.patch('/:id/toggle', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.toggleDealActive);
router.delete('/:id', authenticate, requireRole(['super_admin', 'hotel_manager']), dealController.deleteDeal);

export default router;
