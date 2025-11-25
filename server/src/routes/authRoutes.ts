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
      console.log('=== OAuth Callback Handler Started ===');
      console.log('PUBLIC_BASE_URL:', process.env.PUBLIC_BASE_URL);
      console.log('Request user:', req.user ? 'Present' : 'Missing');
      
      const user = req.user as any;
      
      if (!user) {
        console.error('OAuth callback: No user found in request');
        const errorUrl = `${process.env.PUBLIC_BASE_URL}/signin?error=no_user`;
        console.log('Redirecting to:', errorUrl);
        return res.redirect(errorUrl);
      }

      console.log('User found:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
      });

      // Generate JWT token
      const token = authService.generateToken(user);
      console.log('Token generated:', token ? 'Success' : 'Failed');
      console.log('Token length:', token?.length || 0);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.PUBLIC_BASE_URL}/auth/callback?token=${token}`;
      console.log('Redirecting to frontend:', redirectUrl);
      console.log('=== OAuth Callback Handler Complete ===');
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('=== OAuth Callback Error ===');
      console.error('Error:', error);
      console.error('Error message:', (error as Error).message);
      console.error('Error stack:', (error as Error).stack);
      const errorUrl = `${process.env.PUBLIC_BASE_URL}/signin?error=callback_failed`;
      console.log('Redirecting to error page:', errorUrl);
      res.redirect(errorUrl);
    }
  }
);

// Protected routes
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
