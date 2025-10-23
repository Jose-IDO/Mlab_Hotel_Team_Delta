import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Logo from '../../assets/Logo.png'






export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>

      <div className={styles.navContainer}>
        <div className={styles.SubnavContainer1}>
          <div className={styles.LogoCard}>
          <img src={Logo} alt="Logo" style={{width: '50px', height: '50px'}} />
          </div>
          <div className = {styles.logo}> elta Hotel </div>


          
          </div>
        <div className={styles.SubnavContainer2}>
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

      </div>
    </nav>
  );
};
