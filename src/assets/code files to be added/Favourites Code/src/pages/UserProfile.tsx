import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
import { useFavorites } from "../../contexts/FavoritesContext";
import styles from "./UserProfile.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Booking {
  id: string;
  bookingId?: string;
  hotelName: string;
  roomType: string;
  roomId?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: string;
  guests?: number;
  adults?: number;
  children?: number;
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  createdAt?: string;
  paymentReference?: string;
}

const UserProfile: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "personal" | "bookings" | "favourites"
  >("personal");

  // Personal details
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");

  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [hoveredBooking, setHoveredBooking] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/signin");
      return;
    }
    if (activeTab === "bookings") fetchBookings();
  }, [user, token, navigate, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, phone, address }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      const updatedUser = { ...user, firstName, lastName, phone };
      localStorage.setItem("hotel_user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to change password");
      setSuccess("Password changed successfully!");
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAgain = (booking: Booking) => {
    navigate("/booking", {
      state: {
        roomId: booking.roomId,
        roomType: booking.roomType,
        hotelName: booking.hotelName,
        adults: booking.adults || booking.guests || 2,
        children: booking.children || 0,
        guestDetails: booking.guestDetails || {
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          country: "South Africa",
        },
      },
    });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "cancelled":
        return styles.statusCancelled;
      case "completed":
        return styles.statusCompleted;
      default:
        return "";
    }
  };

  if (!user) return null;

  return (
    <>
      <LoggedInNavbar />
      <div className={styles.container}>
        <div className={styles.profileWrapper}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <span className={styles.avatarInitials}>
                  {user.firstName?.charAt(0).toUpperCase()}
                  {user.lastName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={styles.headerInfo}>
                <h1 className={styles.userName}>
                  {user.firstName} {user.lastName}
                </h1>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "personal" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Personal Details
            </button>

            <button
              className={`${styles.tab} ${
                activeTab === "bookings" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Booking History
            </button>

            <button
              className={`${styles.tab} ${
                activeTab === "favourites" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("favourites")}
            >
              <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Favourites
            </button>
          </div>

          {/* Messages */}
          {error && <div className={styles.errorMessage}>Warning: {error}</div>}
          {success && <div className={styles.successMessage}>Check: {success}</div>}

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* ─────── PERSONAL ─────── */}
            {activeTab === "personal" && (
              <div className={styles.personalSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Personal Information</h2>
                  {!isEditing && !showPasswordChange && (
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input type="email" className={styles.input} value={user.email} disabled />
                    <span className={styles.helperText}>Email cannot be changed</span>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      className={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder="+27 00 000 0000"
                    />
                  </div>
                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.label}>Address</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!isEditing}
                      placeholder="123 Main Street, City, Province"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.formActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(user.firstName || "");
                        setLastName(user.lastName || "");
                        setPhone(user.phone || "");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleUpdateProfile}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {/* Password Section */}
                <div className={styles.passwordSection}>
                  <div className={styles.passwordHeader}>
                    <div>
                      <h3 className={styles.passwordTitle}>Password</h3>
                      <p className={styles.passwordDescription}>
                        Change your password to keep your account secure
                      </p>
                    </div>
                    {!showPasswordChange && !isEditing && (
                      <button
                        className={styles.changePasswordButton}
                        onClick={() => setShowPasswordChange(true)}
                      >
                        Change Password
                      </button>
                    )}
                  </div>

                  {showPasswordChange && (
                    <div className={styles.passwordForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Current Password</label>
                        <input
                          type="password"
                          className={styles.input}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>New Password</label>
                        <input
                          type="password"
                          className={styles.input}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 8 characters)"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Confirm New Password</label>
                        <input
                          type="password"
                          className={styles.input}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className={styles.formActions}>
                        <button
                          className={styles.cancelButton}
                          onClick={() => {
                            setShowPasswordChange(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.saveButton}
                          onClick={handleChangePassword}
                          disabled={loading}
                        >
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─────── BOOKINGS ─────── */}
            {activeTab === "bookings" && (
              <div className={styles.bookingsSection}>
                <h2 className={styles.sectionTitle}>My Bookings</h2>
                {loadingBookings ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>Calendar</div>
                    <h3>No Bookings Yet</h3>
                    <p>You haven't made any bookings. Start exploring our rooms!</p>
                    <button
                      className={styles.browseButton}
                      onClick={() => navigate("/hotel-details")}
                    >
                      Browse Rooms
                    </button>
                  </div>
                ) : (
                  <div className={styles.bookingsList}>
                    {bookings.map((booking) => (
                      <div
                        key={booking.id || booking.bookingId}
                        className={styles.bookingCard}
                        onMouseEnter={() => setHoveredBooking(booking.id || booking.bookingId || "")}
                        onMouseLeave={() => setHoveredBooking(null)}
                      >
                        <div className={styles.bookingHeader}>
                          <div>
                            <h3 className={styles.bookingHotel}>{booking.hotelName}</h3>
                            <p className={styles.bookingRoom}>{booking.roomType}</p>
                          </div>
                          <span
                            className={`${styles.bookingStatus} ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className={styles.bookingDetails}>
                          <div className={styles.bookingDetail}>
                            <span className={styles.detailLabel}>Booking ID:</span>
                            <span className={styles.detailValue}>
                              {booking.bookingId || booking.id}
                            </span>
                          </div>
                          <div className={styles.bookingDetail}>
                            <span className={styles.detailLabel}>Check-in:</span>
                            <span className={styles.detailValue}>{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className={styles.bookingDetail}>
                            <span className={styles.detailLabel}>Check-out:</span>
                            <span className={styles.detailValue}>{formatDate(booking.checkOut)}</span>
                          </div>
                          <div className={styles.bookingDetail}>
                            <span className={styles.detailLabel}>Nights:</span>
                            <span className={styles.detailValue}>{booking.nights}</span>
                          </div>
                          <div className={styles.bookingDetail}>
                            <span className={styles.detailLabel}>Total Price:</span>
                            <span className={styles.detailPrice}>
                              R{booking.totalPrice.toLocaleString()}
                            </span>
                          </div>
                          {booking.createdAt && (
                            <div className={styles.bookingDetail}>
                              <span className={styles.detailLabel}>Booked on:</span>
                              <span className={styles.detailValue}>{formatDate(booking.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        <div
                          className={`${styles.bookAgainContainer} ${
                            hoveredBooking === (booking.id || booking.bookingId)
                              ? styles.showBookAgain
                              : ""
                          }`}
                        >
                          <button
                            className={styles.bookAgainButton}
                            onClick={() => handleBookAgain(booking)}
                          >
                            <svg
                              className={styles.bookAgainIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Book Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─────── FAVOURITES ─────── */}
            {activeTab === "favourites" && (
              <div className={styles.favouritesSection}>
                <h2 className={styles.sectionTitle}>My Favourites</h2>

                {favorites.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>Heart</div>
                    <h3>No favourites yet</h3>
                    <p>Start adding hotels or rooms you love!</p>
                    <button
                      className={styles.browseButton}
                      onClick={() => navigate("/hotel-details")}
                    >
                      Browse Rooms
                    </button>
                  </div>
                ) : (
                  <div className={styles.favouritesGrid}>
                    {favorites.map((fav) => (
                      <div key={fav.id} className={styles.favCard}>
                        {fav.image && (
                          <img src={fav.image} alt={fav.name} className={styles.favImg} />
                        )}
                        <div className={styles.favInfo}>
                          <h4>{fav.name}</h4>
                          {fav.type === "room" && fav.price && (
                            <p className={styles.favPrice}>
                              R {fav.price.toLocaleString()} / night
                            </p>
                          )}
                        </div>

                        <button
                          className={styles.removeFavBtn}
                          onClick={() => toggleFavorite(fav)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;