import React, { useState } from 'react';
import Input from '../../Components/Shared/Input';
import Button from '../../Components/Shared/Button';
import GoogleButton from '../../Components/Shared/GoogleButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isEmail, isPhone, isStrongPassword } from '../../utils/validation';
import styles from './Auth.module.css';
import HomeIcon from '../../assets/home-icon-silhouette-svgrepo-com.svg';
import { API_URL } from '../../config/api';

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let ok = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      ok = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      ok = false;
    }
    if (!isEmail(email)) {
      newErrors.email = 'Invalid email';
      ok = false;
    }
    if (!isPhone(phone)) {
      newErrors.phone = 'Invalid phone';
      ok = false;
    }
    if (!isStrongPassword(password)) {
      newErrors.password = 'Password must be 8+ chars, include uppercase & number';
      ok = false;
    }
    if (password !== confirm) {
      newErrors.confirm = 'Passwords do not match';
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const signupSuccess = await signup(firstName, lastName, email, phone, password);
    if (signupSuccess) {
      // Check if there's a pending booking
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        const bookingData = JSON.parse(pendingBooking);
        sessionStorage.removeItem('pendingBooking');
        navigate('/booking', { state: bookingData });
      } else {
        navigate('/hotel-details');
      }
    } else {
      setErrors({ email: error || 'Registration failed. Email may already be registered.' });
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
            <h1 className={styles.welcomeTitle}>
              Enjoy Your Luxury
              <br />
              Stay With Us.
            </h1>
            <p className={styles.welcomeText}>
              Book with comfort and style. Join our community for exclusive offers and fast booking.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Sign Up</h2>
          <form onSubmit={submit}>
            <div className={styles.nameRow}>
              <Input
                label="First Name"
                placeholder="ex.Kgopotso"
                value={firstName}
                onChange={setFirstName}
                error={errors.firstName}
                name="firstName"
              />
              <Input
                label="Last Name"
                placeholder="ex.Mangena"
                value={lastName}
                onChange={setLastName}
                error={errors.lastName}
                name="lastName"
              />
            </div>
            <Input
              label="E-mail"
              placeholder="example32@gmail.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              name="email"
            />
            <Input
              label="Contact Number"
              placeholder="+27831234567"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              name="phone"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
              name="password"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={setConfirm}
              error={errors.confirm}
              name="confirm"
            />
            <div className={styles.buttonWrapper}>
              <Button
                text={loading ? 'Signing up...' : 'Sign Up'}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>

          <div className={styles.switchText}>
            Already Have Account?{' '}
            <Link to="/signin" className={styles.switchLink}>
              Log-in
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

export default SignUp;

