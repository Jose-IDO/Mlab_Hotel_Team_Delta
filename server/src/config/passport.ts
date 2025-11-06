import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userRepository } from '../repositories/userRepository';
import pool from './db';

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          
          if (!email) {
            return done(new Error('No email provided by Google'), undefined);
          }

          // Check if user exists
          let user = await userRepository.findByEmail(email);

          if (user) {
            // User exists, check if OAuth account is linked
            const oauthCheck = await pool.query(
              'SELECT * FROM oauth_accounts WHERE user_id = $1 AND provider = $2',
              [user.id, 'google']
            );

            if (oauthCheck.rows.length === 0) {
              // Link the Google account to existing user
              await pool.query(
                `INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token, refresh_token, token_expires_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [user.id, 'google', profile.id, accessToken, refreshToken, null]
              );
            } else {
              // Update existing OAuth account tokens
              await pool.query(
                `UPDATE oauth_accounts 
                 SET access_token = $1, refresh_token = $2, token_expires_at = $3
                 WHERE user_id = $4 AND provider = $5`,
                [accessToken, refreshToken, null, user.id, 'google']
              );
            }
          } else {
            // Create new user from Google profile
            const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
            const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';

            user = await userRepository.create({
              email,
              passwordHash: '', // No password for OAuth users
              firstName,
              lastName,
              phone: null,
            });

            // Link Google OAuth account
            await pool.query(
              `INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token, refresh_token)
               VALUES ($1, $2, $3, $4, $5)`,
              [user.id, 'google', profile.id, accessToken, refreshToken]
            );

            // Update profile image if available
            if (profile.photos && profile.photos.length > 0) {
              await pool.query(
                'UPDATE users SET profile_image_url = $1 WHERE id = $2',
                [profile.photos[0].value, user.id]
              );
            }

            // Mark email as verified for OAuth users
            await pool.query(
              'UPDATE users SET email_verified = TRUE WHERE id = $1',
              [user.id]
            );
          }

          // Fetch updated user with roles
          const updatedUser = await userRepository.findById(user.id);
          return done(null, updatedUser || undefined);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
}

export default passport;
