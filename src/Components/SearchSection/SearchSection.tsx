import React from "react";
import styles from "./SearchSection.module.css";

const SearchSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <form className={styles.form}>
          <input type="text" placeholder="City" />
          <select>
            <option>Room Type</option>
            <option>Single</option>
            <option>Double</option>
          </select>
          <input type="date" />
          <input type="date" />
          <input type="number" placeholder="Guests" />
          <button type="submit">Search Hotel</button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
