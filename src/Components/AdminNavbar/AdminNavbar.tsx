import React from "react";
import styles from "./AdminNavbar.module.css";

export const AdminNavbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <span>Delta Hotel Booking</span>
        <div className={styles.currencySection}>
          <span>Currency:</span>
          <select className={styles.currencySelect}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>
        </div>
        <div className={styles.profileSection}>
          <img 
            src="https://via.placeholder.com/40" 
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
