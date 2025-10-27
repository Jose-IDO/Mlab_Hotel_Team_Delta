import React from "react";
import styles from "./AdminNavbar.module.css";
import profileicon from "../../Assets/profile-icon.png";

export const AdminNavbar: React.FC = () => {
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
          <span>Admin</span>
          <button className={styles.logoutButton}>Logout</button>
        </div>
      </div>
    </nav>
  );
};
