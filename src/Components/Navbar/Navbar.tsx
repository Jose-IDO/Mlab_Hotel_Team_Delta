import React, { useState } from "react";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <span>Delta Hotel Booking</span>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
          <li>Home</li>
          <li>Rooms</li>
          <li>Booking</li>
          <li className={styles.redButton}>Sign In</li>
          <li className={styles.redButton}>Sign Up</li>
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
    </nav>
  );
};
