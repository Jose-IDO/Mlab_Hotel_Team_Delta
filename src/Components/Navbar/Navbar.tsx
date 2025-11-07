import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/Logo.png";
import HomeIcon from "../../assets/home-icon-silhouette-svgrepo-com.svg";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../utils/socket"; // make sure socket.ts exports a connected socket

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/signin");
  const handleSignupClick = () => navigate("/signup");
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };
  const handleHomeClick = () => {
    const adminRoles = ["super_admin", "hotel_manager"];
    const hasAdminRole = user?.roles?.some((r: any) => (typeof r === "string" ? r : r?.name) && adminRoles.includes(r));
    navigate(hasAdminRole ? "/admin" : "/dashboard");
  };
  const handleRoomsClick = () => navigate("/hotel-details");

  // Listen for real-time notifications
  useEffect(() => {
    socket.on("newBooking", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newBooking");
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.SubnavContainer1} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className={styles.LogoCard}>
            <img src={Logo} alt="Logo" style={{ width: "50px", height: "50px" }} />
          </div>
          <div className={styles.logo}>Delta Hotel</div>
        </div>

        <div className={styles.SubnavContainer2}>
          <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
            {isAuthenticated ? (
              <>
                <li onClick={handleRoomsClick}>Rooms</li>
                <li className={styles.homeIconWrapper} onClick={handleHomeClick}>
                  <img src={HomeIcon} alt="Home" className={styles.homeIcon} />
                </li>

                {/* Notification Icon */}
                <li className={styles.notificationWrapper}>
                  <FaBell
                    size={22}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/notifications")}
                  />
                  {notifications.length > 0 && (
                    <span className={styles.badge}>{notifications.length}</span>
                  )}
                </li>

                <li>{user ? `${user.firstName} ${user.lastName}` : ""}</li>
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

          <button className={styles.hamburger} onClick={() => setMenuOpen((prev) => !prev)}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};
