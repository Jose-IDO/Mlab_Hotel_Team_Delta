import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

interface SignupFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (signup(email, password, name)) {
      onClose();
    } else {
      setError('Email already exists');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className={styles.switchBtn}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
