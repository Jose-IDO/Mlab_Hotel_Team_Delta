import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate(`/signin?error=${error}`);
        return;
      }

      if (!token) {
        console.error('No token received from OAuth');
        navigate('/signin?error=no_token');
        return;
      }

      try {
        // Store token in localStorage
        localStorage.setItem('hotel_token', token);

        // Fetch full user details
        const API_URL = (import.meta as any).env.VITE_API_URL as string;
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        
        if (data.ok && data.data) {
          // Store user in localStorage
          localStorage.setItem('hotel_user', JSON.stringify(data.data.user));

          // Check if user has admin roles
          const adminRoles = ['super_admin', 'hotel_manager'];
          const isAdmin = data.data.user.roles?.some((r: any) => adminRoles.includes(r.name));

          // Check for pending booking
          const pendingBooking = sessionStorage.getItem('pendingBooking');
          if (pendingBooking) {
            const bookingData = JSON.parse(pendingBooking);
            sessionStorage.removeItem('pendingBooking');
            navigate('/booking', { state: bookingData });
          } else if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/hotel-details');
          }
          
          // Reload to update auth context
          window.location.reload();
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (error) {
        console.error('OAuth callback processing error:', error);
        localStorage.removeItem('hotel_token');
        navigate('/signin?error=callback_processing_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <h2>Completing sign in...</h2>
        <p>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
