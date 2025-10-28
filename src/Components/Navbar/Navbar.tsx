import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from '../../assets/Logo.png';
import HomeIcon from '../../assets/home-icon-silhouette-svgrepo-com.svg';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleRoomsClick = () => {
    navigate('/rooms');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.SubnavContainer1} onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <div className={styles.LogoCard}>
              <img src={Logo} alt="Logo" style={{width: '50px', height: '50px'}} />
            </div>
            <div className={styles.logo}>Delta Hotel</div>
          </div>
          <div className={styles.SubnavContainer2}>
            <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
              {isAuthenticated ? (
                <>
                  <li className={styles.homeIconWrapper} onClick={handleHomeClick}>
                    <img src={HomeIcon} alt="Home" className={styles.homeIcon} />
                  </li>
                  <li>{user?.name}</li>
                  <li className={styles.redButton} onClick={handleLogout}>Logout</li>
                </>
              ) : (
                <>
                  <li onClick={handleRoomsClick}>Rooms</li>
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
    </>
  );
};