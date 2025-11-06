import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
  const {
    hotelName = "Ritz Plaza Hotel",
    roomType = "Luxury Deluxe Suite",
    checkIn = "2025-10-14",
    checkOut = "2025-10-17",
    nights = 3,
    totalPrice = 3600,
  } = state || {};

  // --- Format stay string ---
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  const stay = `${nights} Night${nights > 1 ? "s" : ""}, ${formatDate(checkIn)} - ${formatDate(checkOut)}`;
  const priceDisplay = `R${totalPrice.toLocaleString()}`;
  const cancellationFee = "R300 if cancelled within 24 hrs";

  // --- Guests state ---
  const [guests, setGuests] = useState<Guest[]>([
    {
      firstName: "Franks",
      lastName: "Mauleke",
      email: "Mauleke@gmail.com",
      country: "South Africa",
      phone: "+27 63 956 985",
    },
  ]);

  const addGuest = () => {
    setGuests((prev) => [
      ...prev,
      { firstName: "", lastName: "", email: "", country: "", phone: "" },
    ]);
  };

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleContinue = () => {
    console.log("Booking data:", { hotelName, roomType, stay, totalPrice, guests });
    // TODO: Navigate to payment
  };

  return (
    <>
      <LoggedInNavbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* LEFT: Hotel Info */}
          <aside className={styles.hotelInfo}>
            <img src={hotelImage} alt={hotelName} className={styles.hotelImg} />
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

          {/* RIGHT: Guest Form */}
          <section className={styles.guestSection}>
            <h2 className={styles.sectionTitle}>Guest details</h2>

            {guests.map((guest, idx) => (
              <div key={idx} className={styles.guestCard}>
                <h3 className={styles.guestHeader}>Guest {idx + 1}</h3>

                {/* First & Last Name */}
                <div className={styles.row}>
                  <Input
                    label="First Name"
                    placeholder="First Name"
                    value={guest.firstName}
                    onChange={(v) => updateGuest(idx, "firstName", v)}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Last Name"
                    value={guest.lastName}
                    onChange={(v) => updateGuest(idx, "lastName", v)}
                  />
                </div>

                {/* Email */}
                <Input
                  label="E-mail"
                  placeholder="example@domain.com"
                  type="email"
                  value={guest.email}
                  onChange={(v) => updateGuest(idx, "email", v)}
                />

                {/* Country (Styled Select) + Phone */}
                <div className={styles.row}>
                  {/* Country Dropdown */}
                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Country</label>
                    <select
                      className={styles.countrySelect}
                      value={guest.country}
                      onChange={(e) => updateGuest(idx, "country", e.target.value)}
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
                    onChange={(v) => updateGuest(idx, "phone", v)}
                  />
                </div>
              </div>
            ))}

            {/* Add Guest Button */}
            <button className={styles.addGuestBtn} onClick={addGuest}>
              Add guest
            </button>

            {/* Continue Button */}
            <Button text="Continue to payment" onClick={handleContinue} type="button" />
          </section>
        </div>
      </main>
    </>
  );
};

export default BookingPage;