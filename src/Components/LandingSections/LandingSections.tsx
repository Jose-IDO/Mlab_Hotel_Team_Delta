import React from "react";
import styles from "./LandingSections.module.css";
import comedyClub from "../../assets/comedy-club.jpg";
import liveBand from "../../assets/live-band.jpg";
import charityDinner from "../../assets/charity-dinner.jpg";

const LandingSections: React.FC = () => {
  const eventImages = [comedyClub, liveBand, charityDinner];

  return (
    <div className={styles.landingPage}>

      {/* ---------- UPCOMING EVENTS SECTION ---------- */}
      <section className={styles.upcomingSection}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        <div className={styles.eventsGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.eventCard}>
              <div className={styles.eventImagePlaceholder}>
                <img src={eventImages[index]} alt={`Event ${index + 1}`} />
              </div>
              <div className={styles.eventDetails}>
                <h3 className={styles.eventTitle}>
                  {index === 0 && "Comedy Night"}
                  {index === 1 && "Music & Memories Night"}
                  {index === 2 && "Charity Event"}
                </h3>
                <p className={styles.eventDate}>
                  {index === 0 && "Nov 25"}
                  {index === 1 && "Nov 28"}
                  {index === 2 && "Dec 15"}
                </p>
                <p className={styles.eventDescription}>
                  {index === 0 &&
                    "Book your room and enjoy free comedy night with us."}
                  {index === 1 &&
                    "Join us for a night of music and memories — book now and celebrate love!"}
                  {index === 2 &&
                    "Be the reason someone smiles today — join our charity event."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ADDRESS SECTION ---------- */}
      <section className={styles.addressSection}>
        <h2 className={styles.sectionTitle}>Our Address</h2>
        <div className={styles.addressCard}>
          <div className={styles.mapPlaceholder}>Map Image Placeholder</div>
          <div className={styles.addressDetails}>
            <p>The Innovation Hub</p>
            <p>The Enterprise Building</p>
            <p>Allan Cormack St, Persequor, Pretoria, 0020</p>
            <a
              href="https://maps.app.goo.gl/i55D5Rdb1XTL4r8M9"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER SECTION ---------- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h4>Useful Links</h4>
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Terms & Conditions</li>
              <li>Privacy & Cookies</li>
              <li>Human Rights Statement</li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>Follow Us</h4>
            <div className={styles.socialIcons}>
              <div className={styles.iconPlaceholder}>FB</div>
              <div className={styles.iconPlaceholder}>IG</div>
              <div className={styles.iconPlaceholder}>X</div>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>Address</h4>
            <p>The Innovation Hub</p>
            <p>The Enterprise Building</p>
            <p>Allan Cormack St, Persequor</p>
            <p>Pretoria, 0020</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 Delta Hotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingSections;

