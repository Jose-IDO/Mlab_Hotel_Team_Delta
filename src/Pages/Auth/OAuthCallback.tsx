import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.css';
import { API_URL } from '../../config/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        alert(`Google sign in failed: ${error}`);
        navigate(`/signin?error=${error}`);
        return;
      }

      if (!token) {
        console.error('No token received from OAuth');
        alert('No authentication token received. Please try again.');
        navigate('/signin?error=no_token');
        return;
      }

      try {
        localStorage.setItem('hotel_token', token);
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch user details:', errorText);
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        
        if (data.ok && data.data) {
          const user = data.data;
          
          localStorage.setItem('hotel_user', JSON.stringify(user));

          const adminRoles = ['super_admin', 'hotel_manager'];
          const isAdmin = user.roles?.some((r: any) => adminRoles.includes(r.name));

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
          
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (error) {
        console.error('OAuth callback processing error:', error);
        localStorage.removeItem('hotel_token');
        alert('Failed to complete sign in. Please try again.');
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
