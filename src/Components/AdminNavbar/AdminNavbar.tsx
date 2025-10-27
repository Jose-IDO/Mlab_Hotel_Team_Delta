import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminNavbar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import profileicon from "../../Assets/profile-icon.png";

export const AdminNavbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <span>Delta Hotel Booking</span>
        <div className={styles.profileSection}>
          <img 
            src={profileicon} 
            alt="Admin Profile" 
            className={styles.profilePicture}
          />  
          <span>{user?.name || 'Admin'}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};
