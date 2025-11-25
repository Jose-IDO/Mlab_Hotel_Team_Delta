import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.css';
import { API_URL } from '../../config/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Handle GitHub Pages redirect format: /?/auth/callback&token=...
      let token: string | null = null;
      let error: string | null = null;
      
      // First, check if we're in GitHub Pages redirect format
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('/');
      
      if (redirectPath) {
        // GitHub Pages format: "auth/callback~and~token=abc123" or "auth/callback&token=abc123"
        const parts = redirectPath.split('~and~');
        const queryString = parts.slice(1).join('&').replace(/~and~/g, '&');
        
        // Extract token from the query string
        if (queryString) {
          const queryParams = new URLSearchParams(queryString);
          token = queryParams.get('token');
          error = queryParams.get('error');
        }
        
        // Also check if token is in the main URL params (after redirect processing)
        if (!token) {
          const mainParams = new URLSearchParams(window.location.search);
          mainParams.delete('/');
          token = mainParams.get('token');
          error = mainParams.get('error') || error;
        }
      } else {
        // Normal format: /auth/callback?token=...
        token = searchParams.get('token') || urlParams.get('token');
        error = searchParams.get('error') || urlParams.get('error');
      }

      console.log('OAuth Callback - Token:', token ? 'Present' : 'Missing');
      console.log('OAuth Callback - Error:', error);
      console.log('OAuth Callback - Full URL:', window.location.href);
      console.log('OAuth Callback - Redirect Path:', redirectPath);
      console.log('OAuth Callback - Search Params:', Array.from(searchParams.entries()));
      console.log('OAuth Callback - URL Params:', Array.from(urlParams.entries()));

      if (error) {
        console.error('OAuth error:', error);
        alert(`Google sign in failed: ${error}`);
        navigate(`/signin?error=${error}`);
        return;
      }

      if (!token) {
        console.error('No token received from OAuth');
        console.error('Search params:', Array.from(searchParams.entries()));
        console.error('URL params:', Array.from(urlParams.entries()));
        alert('No authentication token received. Please try again.');
        navigate('/signin?error=no_token');
        return;
      }

      try {
        console.log('=== Storing token in localStorage ===');
        localStorage.setItem('hotel_token', token);
        console.log('Token stored successfully');
        
        console.log('=== Fetching user details from API ===');
        console.log('API_URL:', API_URL);
        console.log('Endpoint:', `${API_URL}/auth/me`);
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('=== Failed to fetch user details ===');
          console.error('Status:', response.status);
          console.error('Error text:', errorText);
          throw new Error(`Failed to fetch user details: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('=== User data received ===');
        console.log('Response data:', data);
        
        if (data.ok && data.data) {
          const user = data.data;
          console.log('User object:', user);
          console.log('User roles:', user.roles);
          
          localStorage.setItem('hotel_user', JSON.stringify(user));
          console.log('User stored in localStorage');

          const adminRoles = ['super_admin', 'hotel_manager'];
          const isAdmin = user.roles?.some((r: any) => adminRoles.includes(r.name));
          console.log('Is admin:', isAdmin);

          const pendingBooking = sessionStorage.getItem('pendingBooking');
          if (pendingBooking) {
            console.log('Pending booking found, redirecting to booking page');
            const bookingData = JSON.parse(pendingBooking);
            sessionStorage.removeItem('pendingBooking');
            navigate('/booking', { state: bookingData });
          } else if (isAdmin) {
            console.log('Admin user, redirecting to /admin');
            navigate('/admin');
          } else {
            console.log('Regular user, redirecting to /hotel-details');
            navigate('/hotel-details');
          }
          
          console.log('=== OAuth callback complete, reloading page ===');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          console.error('=== Invalid user data ===');
          console.error('Response:', data);
          throw new Error('Invalid user data received');
        }
      } catch (error: any) {
        console.error('=== OAuth callback processing error ===');
        console.error('Error:', error);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        localStorage.removeItem('hotel_token');
        alert(`Failed to complete sign in: ${error?.message || 'Unknown error'}. Check console for details.`);
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
