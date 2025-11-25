import React, { useState } from 'react';
import Input from '../../Components/Shared/Input';
import Button from '../../Components/Shared/Button';
import GoogleButton from '../../Components/Shared/GoogleButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';
import HomeIcon from '../../assets/home-icon-silhouette-svgrepo-com.svg';
import { API_URL } from '../../config/api';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let ok = true;
    setEmailError('');
    setPasswordError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email');
      ok = false;
    }
    if (!password) {
      setPasswordError('Password required');
      ok = false;
    }
    return ok;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const success = await login(email, password);
    
    if (success && user) {
      // Check if user has admin roles
      const adminRoles = ['super_admin', 'hotel_manager'];
      const isAdmin = user.roles?.some(r => adminRoles.includes(r.name));
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/hotel-details');
      }
    } else {
      setPasswordError(error || 'Invalid email or password');
    }
  };

  return (
    <div className={styles.container}>
      {/* Home Button with Icon */}
      <button 
        className={styles.homeButton} 
        onClick={() => navigate('/')}
        aria-label="Go to home page"
      >
        <img src={HomeIcon} alt="Home" className={styles.homeIcon} />
      </button>

      <div className={styles.leftPanel}>
        <div className={styles.leftOverlay}>
          <div className={styles.leftContent}>
            <h1 className={styles.welcomeTitle}>Welcome Back</h1>
            <p className={styles.welcomeText}>
              Sign in to continue your booking and manage reservations.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Sign In</h2>
          <form onSubmit={submit}>
            <Input
              label="E-mail"
              placeholder="example32@gmail.com"
              value={email}
              onChange={setEmail}
              error={emailError}
              name="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={passwordError}
              name="password"
            />
            <div className={styles.buttonWrapper}>
              <Button
                text={loading ? 'Signing in...' : 'Sign In'}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>

          <div className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.switchLink}>
              Sign up
            </Link>
          </div>

          <div className={styles.divider}>Or</div>
          <GoogleButton onClick={(e) => {
            e?.preventDefault();
            try {
              const googleAuthUrl = `${API_URL}/auth/google`;
              console.log('Redirecting to Google OAuth:', googleAuthUrl);
              window.location.href = googleAuthUrl;
            } catch (err) {
              console.error('Google OAuth redirect error:', err);
              alert('Failed to initiate Google sign in. Please try again.');
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

