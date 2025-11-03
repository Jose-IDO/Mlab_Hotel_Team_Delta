import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchSection.module.css";

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to hotel details page (which shows all available rooms)
    navigate('/hotel-details');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSearch}>
          <select 
            value={roomType} 
            onChange={(e) => setRoomType(e.target.value)}
            className={styles.select}
          >
            <option value="">Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Family">Family</option>
          </select>
          <input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            placeholder="Check-in"
            className={styles.input}
          />
          <input 
            type="date" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            placeholder="Check-out"
            className={styles.input}
          />
          <input 
            type="number" 
            placeholder="Guests" 
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.searchButton}>Search Rooms</button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
