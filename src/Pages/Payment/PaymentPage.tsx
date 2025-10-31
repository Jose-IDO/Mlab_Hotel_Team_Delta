import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoggedInNavbar } from "../../Components/LoggedInNavbar/LoggedInNavbar";
import Button from "../../Components/Shared/Button";
import Input from "../../Components/Shared/Input";
import styles from "./PaymentPage.module.css";

const PaymentPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const {
    hotelName = "Delta Hotel",
    roomType = "Luxury Suite",
    roomImage,
    checkIn,
    checkOut,
    nights = 3,
    adults = 2,
    children = 0,
    pricePerNight = 1200,
    totalPrice = 3600,
    guest = { firstName: "", lastName: "", email: "", country: "", phone: "" },
  } = state || {};

  // Payment form state
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("South Africa");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length <= 4 && /^\d*$/.test(cleaned)) {
      if (cleaned.length >= 2) {
        setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
      } else {
        setExpiryDate(cleaned);
      }
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let ok = true;

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
      ok = false;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      ok = false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be MM/YY';
      ok = false;
    }
    if (cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
      ok = false;
    }
    if (!billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
      ok = false;
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
      ok = false;
    }
    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate booking ID
      const bookingId = Math.random().toString(36).substring(2, 15).toUpperCase();
      
      // Prepare confirmation data
      const confirmationData = {
        bookingId,
        hotelName,
        roomType,
        roomImage,
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        totalPrice,
        guest,
        paymentMethod: `Visa **** ${cardNumber.slice(-4)}`,
        cardholderName,
      };

      // Navigate to confirmation
      navigate('/booking-confirmation', { state: confirmationData });
    }, 2000);
  };

  return (
    <>
      <LoggedInNavbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* LEFT: Booking Summary */}
          <aside className={styles.bookingSummary}>
            {roomImage && (
              <img src={roomImage} alt={hotelName} className={styles.hotelImg} />
            )}
            <div className={styles.infoBlock}>
              <h2 className={styles.summaryTitle}>Booking Summary</h2>
              
              <div className={styles.summaryRow}>
                <span className={styles.label}>Hotel:</span>
                <span className={styles.value}>{hotelName}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Room:</span>
                <span className={styles.value}>{roomType}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Check-in:</span>
                <span className={styles.value}>{formatDate(checkIn)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Check-out:</span>
                <span className={styles.value}>{formatDate(checkOut)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Guests:</span>
                <span className={styles.value}>{adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Nights:</span>
                <span className={styles.value}>{nights}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.priceRow}>
                <span>R{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>R{totalPrice.toLocaleString()}</span>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalPrice}>R{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </aside>

          {/* RIGHT: Payment Form */}
          <section className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>Payment Details</h2>

            <form onSubmit={handlePayment}>
              {/* Card Information */}
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>Card Information</h3>

                <Input
                  label="Cardholder Name"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={setCardholderName}
                  error={errors.cardholderName}
                  name="cardholderName"
                />

                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  error={errors.cardNumber}
                  name="cardNumber"
                />

                <div className={styles.row}>
                  <Input
                    label="Expiry Date (MM/YY)"
                    placeholder="12/25"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    error={errors.expiryDate}
                    name="expiryDate"
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    error={errors.cvv}
                    name="cvv"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>Billing Address</h3>

                <Input
                  label="Street Address"
                  placeholder="123 Main Street"
                  value={billingAddress}
                  onChange={setBillingAddress}
                  error={errors.billingAddress}
                  name="billingAddress"
                />

                <div className={styles.row}>
                  <Input
                    label="City"
                    placeholder="Pretoria"
                    value={city}
                    onChange={setCity}
                    error={errors.city}
                    name="city"
                  />
                  <Input
                    label="Postal Code"
                    placeholder="0001"
                    value={postalCode}
                    onChange={setPostalCode}
                    error={errors.postalCode}
                    name="postalCode"
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Country</label>
                  <select
                    className={styles.countrySelect}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="South Africa">South Africa</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Mozambique">Mozambique</option>
                  </select>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                text={loading ? 'Processing Payment...' : `Pay R${totalPrice.toLocaleString()}`}
                type="submit"
                disabled={loading}
              />
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

export default PaymentPage;

