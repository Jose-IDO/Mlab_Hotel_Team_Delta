import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import passport from '../config/passport';
import { authService } from '../services/authService';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-token', authController.verifyToken.bind(authController));

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.PUBLIC_BASE_URL}/signin?error=oauth_failed`
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.redirect(`${process.env.PUBLIC_BASE_URL}/signin?error=no_user`);
      }

      // Generate JWT token
      const token = authService.generateToken(user);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.PUBLIC_BASE_URL}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.PUBLIC_BASE_URL}/signin?error=callback_failed`);
    }
  }
);

// Protected routes
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
