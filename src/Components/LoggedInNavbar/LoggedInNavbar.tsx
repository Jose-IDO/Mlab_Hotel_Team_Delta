import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./LoggedInNavbar.module.css";
import Logo from '../../assets/Logo.png';

export const LoggedInNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <img src={Logo} alt="Delta Hotel Logo" style={{width: '40px', height: '40px'}} />
        <h2 className={styles.brandName}>Delta Hotels</h2>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search..." 
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.notificationIcon}>🔔</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'User'}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
