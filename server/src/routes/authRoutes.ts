import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-token', authController.verifyToken.bind(authController));

// Protected routes
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
