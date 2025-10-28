import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Logo from '../../assets/Logo.png'
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../Auth/LoginForm';
import { SignupForm } from '../Auth/SignupForm';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.SubnavContainer1}>
            <div className={styles.LogoCard}>
              <img src={Logo} alt="Logo" style={{width: '50px', height: '50px'}} />
            </div>
            <div className={styles.logo}>Delta Hotel</div>
          </div>
          <div className={styles.SubnavContainer2}>
            <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
              <li><a href="/">Home</a></li>
              {isAuthenticated && <li><a href="/dashboard">Dashboard</a></li>}
              <li>Rooms</li>
              <li>Booking</li>
              {isAuthenticated ? (
                <>
                  <li>Welcome, {user?.name}</li>
                  {user?.role === 'admin' && <li><a href="/admin">Admin</a></li>}
                  <li className={styles.redButton} onClick={handleLogout}>Logout</li>
                </>
              ) : (
                <>
                  <li className={styles.redButton} onClick={handleLoginClick}>Sign In</li>
                  <li className={styles.redButton} onClick={handleSignupClick}>Sign Up</li>
                </>
              )}
            </ul>
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
            </button>
          </div>
        </div>
      </nav>

      {showLogin && (
        <LoginForm 
          onClose={handleCloseAuth} 
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }} 
        />
      )}

      {showSignup && (
        <SignupForm 
          onClose={handleCloseAuth} 
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }} 
        />
      )}
    </>
  );
};