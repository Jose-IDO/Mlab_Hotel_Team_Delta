import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('OAuth callback triggered');
      console.log('Search params:', window.location.search);
      
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Error:', error);

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
        // Store token in localStorage
        localStorage.setItem('hotel_token', token);
        console.log('Token stored in localStorage');

        // Fetch full user details
        const API_URL = (import.meta as any).env.VITE_API_URL as string;
        console.log('Fetching user details from:', `${API_URL}/auth/me`);
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('User details response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch user details:', errorText);
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        console.log('User data received:', data);
        
        if (data.ok && data.data) {
          // The user object is directly in data.data (not data.data.user)
          const user = data.data;
          
          // Store user in localStorage
          localStorage.setItem('hotel_user', JSON.stringify(user));
          console.log('User stored in localStorage');

          // Check if user has admin roles
          const adminRoles = ['super_admin', 'hotel_manager'];
          const isAdmin = user.roles?.some((r: any) => adminRoles.includes(r.name));
          console.log('Is admin:', isAdmin);

          // Check for pending booking
          const pendingBooking = sessionStorage.getItem('pendingBooking');
          if (pendingBooking) {
            console.log('Redirecting to booking with pending data');
            const bookingData = JSON.parse(pendingBooking);
            sessionStorage.removeItem('pendingBooking');
            navigate('/booking', { state: bookingData });
          } else if (isAdmin) {
            console.log('Redirecting to admin dashboard');
            navigate('/admin');
          } else {
            console.log('Redirecting to hotel details');
            navigate('/hotel-details');
          }
          
          // Reload to update auth context
          console.log('Reloading page to update auth context');
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
