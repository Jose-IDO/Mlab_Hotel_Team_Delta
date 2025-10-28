import React, { useState } from 'react';
import Input from '../../Components/Shared/Input';
import Button from '../../Components/Shared/Button';
import GoogleButton from '../../Components/Shared/GoogleButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setPasswordError('Invalid email or password');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className={styles.container}>
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
          <GoogleButton onClick={() => alert('Mock Google Sign-in')} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

