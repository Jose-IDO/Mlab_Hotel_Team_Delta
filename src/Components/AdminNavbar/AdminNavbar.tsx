import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminNavbar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import profileicon from "../../Assets/profile-icon.png";
import HomeIcon from "../../assets/home-icon-silhouette-svgrepo-com.svg";

export const AdminNavbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.leftSection}>
          <div className={styles.homeIconWrapper} onClick={handleHomeClick}>
            <img src={HomeIcon} alt="Home" className={styles.homeIcon} />
          </div>
          <span>Delta Hotel Booking</span>
        </div>
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
