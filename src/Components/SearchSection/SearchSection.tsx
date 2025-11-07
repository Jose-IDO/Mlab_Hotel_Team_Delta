import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchSection.module.css";

const API_URL = (import.meta as any).env.VITE_API_URL as string;

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<string>("");

  // Fetch available room types from API
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/rooms?status=active`);
        const json = await res.json();
        if (res.ok && json.ok) {
          const types = new Set<string>();
          json.data.forEach((room: any) => {
            if (room.roomType) types.add(room.roomType);
          });
          setRoomTypes(Array.from(types).sort());
        }
      } catch (e) {
        console.error('Failed to fetch room types:', e);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to hotel details page with search params
    const searchParams = new URLSearchParams();
    if (selectedRoomType !== "all") searchParams.set("roomType", selectedRoomType);
    if (checkIn) searchParams.set("checkIn", checkIn);
    if (checkOut) searchParams.set("checkOut", checkOut);
    if (guests) searchParams.set("guests", guests);

    const queryString = searchParams.toString();
    navigate(`/hotel-details${queryString ? `?${queryString}` : ""}`);
  };

  // Set minimum dates (today for check-in, tomorrow for check-out)
  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSearch}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Room Type</label>
            <select 
              className={styles.select}
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
            >
              <option value="all">All Room Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Check-in</label>
            <input 
              className={styles.input}
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Check-out</label>
            <input 
              className={styles.input}
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={minCheckOut}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Guests</label>
            <input 
              className={styles.input}
              type="number" 
              placeholder="Number of guests" 
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
            />
          </div>
          
          <button className={styles.searchButton} type="submit">Search Room</button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
