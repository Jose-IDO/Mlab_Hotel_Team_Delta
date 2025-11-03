import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./LoggedInNavbar.module.css";
import Logo from '../../assets/Logo.png';
import SouthAfricaFlag from '../../assets/south-africa-svgrepo-com.svg';

export const LoggedInNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection} onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <img src={Logo} alt="Delta Hotel Logo" style={{width: '40px', height: '40px'}} />
        <h2 className={styles.brandName}>Delta Hotels</h2>
      </div>

      {/* Navigation Links
      <div className={styles.navLinks}>
        <button className={styles.navLink} onClick={handleBrowseRooms}>
          Browse Rooms
        </button>
      </div> */}

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
        {isAuthenticated ? (
          <>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
              <img src={SouthAfricaFlag} alt="South Africa" className={styles.flagIcon} />
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className={styles.authButtons}>
            <button className={styles.signInBtn} onClick={handleLoginClick}>
              Sign In
            </button>
            <button className={styles.signUpBtn} onClick={handleSignupClick}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
