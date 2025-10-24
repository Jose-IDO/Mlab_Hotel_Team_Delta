import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      onClose();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className={styles.switchBtn}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
