import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
import Button from "../../Components/Shared/Button";
import Input from "../../Components/Shared/Input";
import styles from "./BookingPage.module.css";
import hotelImage from "../../assets/Santorini_7.jpg";   // ← Your image

interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
}

const BookingPage: React.FC = () => {
  // --- Read data from RoomDetails ---
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    hotelName = "Delta Hotel",
    roomType = "Luxury Deluxe Suite",
    roomImage = hotelImage,
    pricePerNight: initialPricePerNight = 1200,
  } = state || {};

  // --- Booking form state (dates and guests count) ---
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    return nextWeek.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Calculate nights and total price
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const totalPrice = initialPricePerNight * nights;

  // --- Format stay string ---
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  const stay = `${nights} Night${nights > 1 ? "s" : ""}, ${formatDate(checkIn)} - ${formatDate(checkOut)}`;
  const priceDisplay = `R${totalPrice.toLocaleString()}`;
  const cancellationFee = "R300 if cancelled within 24 hrs";

  // --- Primary guest details state (only one guest form) ---
  const [guest, setGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    email: "",
    country: "South Africa",
    phone: "",
  });

  const updateGuest = (field: keyof Guest, value: string) => {
    setGuest((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Prepare booking data for payment page
    const bookingData = {
      hotelName,
      roomType,
      roomImage,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      pricePerNight: initialPricePerNight,
      totalPrice,
      guest, // Single guest object instead of array
    };
    
    console.log("Proceeding to payment with data:", bookingData);
    navigate('/payment', { state: bookingData });
  };

  return (
    <>
      <LoggedInNavbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* LEFT: Hotel Info */}
          <aside className={styles.hotelInfo}>
            <img src={roomImage} alt={hotelName} className={styles.hotelImg} />
            <div className={styles.infoBlock}>
              <p className={styles.label}>Hotel Name:</p>
              <p className={styles.value}>{hotelName}</p>

              <p className={styles.label}>Room Type:</p>
              <p className={styles.value}>{roomType}</p>

              <p className={styles.label}>Total Stay:</p>
              <p className={styles.value}>{stay}</p>

              <p className={styles.label}>Total Price:</p>
              <p className={styles.price}>{priceDisplay}</p>

              <p className={styles.cancellation}>{cancellationFee}</p>
            </div>
          </aside>

          {/* RIGHT: Booking & Guest Form */}
          <section className={styles.guestSection}>
            {/* Booking Details Form */}
            <div className={styles.bookingFormCard}>
              <h2 className={styles.sectionTitle}>Booking Details</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Adults</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Children</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>R{initialPricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>R{totalPrice.toLocaleString()}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>R{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Guest Details Form */}
            <h2 className={styles.sectionTitle} style={{marginTop: '2rem'}}>Primary Guest Details</h2>

            <div className={styles.guestCard}>
              <h3 className={styles.guestHeader}>Contact Person</h3>

              {/* First & Last Name */}
              <div className={styles.row}>
                <Input
                  label="First Name"
                  placeholder="First Name"
                  value={guest.firstName}
                  onChange={(v) => updateGuest("firstName", v)}
                />
                <Input
                  label="Last Name"
                  placeholder="Last Name"
                  value={guest.lastName}
                  onChange={(v) => updateGuest("lastName", v)}
                />
              </div>

              {/* Email */}
              <Input
                label="E-mail"
                placeholder="example@domain.com"
                type="email"
                value={guest.email}
                onChange={(v) => updateGuest("email", v)}
              />

              {/* Country (Styled Select) + Phone */}
              <div className={styles.row}>
                {/* Country Dropdown */}
                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Country</label>
                  <select
                    className={styles.countrySelect}
                    value={guest.country}
                    onChange={(e) => updateGuest("country", e.target.value)}
                  >
                    <option value="">Select country</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Mozambique">Mozambique</option>
                  </select>
                </div>

                {/* Phone */}
                <Input
                  label="Phone number"
                  placeholder="+27 00 000 0000"
                  value={guest.phone}
                  onChange={(v) => updateGuest("phone", v)}
                />
              </div>
            </div>

            {/* Info Message */}
            <p className={styles.guestInfo}>
              💡 This information will be used for booking confirmation and communication.
            </p>

            {/* Continue Button */}
            <Button text="Continue to payment" onClick={handleContinue} type="button" />
          </section>
        </div>
      </main>
    </>
  );
};

export default BookingPage;