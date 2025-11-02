import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingConfirmation.module.css";

const BookingConfirmation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);

  const {
    bookingId = "UNKNOWN",
    hotelName = "Delta Hotel",
    roomType = "Luxury Suite",
    checkIn,
    checkOut,
    nights = 3,
    totalPrice = 3600,
    guest = { firstName: "", lastName: "", email: "", country: "", phone: "" },
    paymentMethod = "Visa **** 1234",
    cardholderName = "Guest",
  } = state || {};

  useEffect(() => {
    const timer = setTimeout(() => setIsRedirecting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const downloadReceipt = () => {
    // Create a simple text receipt
    const receiptContent = `
===========================================
        DELTA HOTEL BOOKING RECEIPT
===========================================

Booking ID: ${bookingId}
Date: ${new Date().toLocaleString()}

-------------------------------------------
BOOKING DETAILS
-------------------------------------------
Hotel: ${hotelName}
Room Type: ${roomType}
Check-in: ${formatDate(checkIn)}
Check-out: ${formatDate(checkOut)}
Nights: ${nights}

-------------------------------------------
GUEST INFORMATION
-------------------------------------------
Primary Guest: ${guest.firstName} ${guest.lastName}
Email: ${guest.email}
Phone: ${guest.phone}
Country: ${guest.country}

-------------------------------------------
PAYMENT INFORMATION
-------------------------------------------
Amount Paid: R${totalPrice.toLocaleString()}
Payment Method: ${paymentMethod}
Cardholder: ${cardholderName}

-------------------------------------------
Thank you for choosing Delta Hotel!
For questions, contact: support@deltahotel.com
===========================================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <span className={styles.companyName}>Delta Hotel Booking</span>
        </div>
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            {cardholderName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {isRedirecting ? (
          /* STATE 1: Payment Successful - Redirecting */
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.iconWrapper}>
              <div className={styles.successIcon}>
                <svg className={styles.checkmark} viewBox="0 0 52 52">
                  <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                  <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            <h1 className={styles.title}>Payment Successful</h1>
            <p className={styles.subtitle}>Redirecting to booking confirmation...</p>
            <div className={styles.loader}></div>
          </div>
        ) : (
          /* STATE 2: Booking Confirmed */
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.iconWrapper}>
              <div className={styles.successIcon}>
                <svg className={styles.checkmark} viewBox="0 0 52 52">
                  <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                  <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>

            <h1 className={styles.titleLarge}>Booking Confirmed</h1>
            <p className={styles.bookingId}>
              ID# <span className={styles.bookingIdValue}>{bookingId}</span>
            </p>
            <p className={styles.confirmationText}>
              A confirmation email will be sent to your email shortly.
            </p>

            <div className={styles.actions}>
              <button
                className={styles.downloadBtn}
                onClick={downloadReceipt}
              >
                <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Receipt
              </button>

              <button
                className={styles.dashboardBtn}
                onClick={handleBackToDashboard}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;

