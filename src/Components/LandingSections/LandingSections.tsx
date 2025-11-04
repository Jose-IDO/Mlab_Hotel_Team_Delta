import React, { useState } from "react";
import styles from "./LandingSections.module.css";
import comedyClub from "../../assets/comedy-club.jpg";
import liveBand from "../../assets/live-band.jpg";
import charityDinner from "../../assets/charity-dinner.jpg";
import { DestinationsSection } from "../DestinationsSection/DestinationsSection";

const LandingSections: React.FC = () => {
  const eventImages = [comedyClub, liveBand, charityDinner];
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);

  const linkInfo: Record<string, { title: string; content: string }> = {
    "About Us": {
      title: "About Delta Hotel",
      content: "Discover our story of luxury hospitality. Delta Hotel has been providing world-class accommodation and exceptional service since our establishment. We pride ourselves on creating memorable experiences for every guest.\n\nOur journey began with a simple vision: to create a home away from home for travelers seeking comfort, elegance, and exceptional service. Today, we continue to uphold these values, offering state-of-the-art facilities, personalized attention, and an unwavering commitment to excellence.\n\nAt Delta Hotel, every guest is part of our family. We believe in creating lasting memories through thoughtful gestures, attention to detail, and a warm, welcoming atmosphere that makes you feel truly special."
    },
    "Contact Us": {
      title: "Get in Touch",
      content: "📧 Email: info@deltahotel.co.za\n📞 Phone: +27 12 345 6789\n📱 WhatsApp: +27 12 345 6789\n📍 Address: 1 Mark Shuttleworth Street, Lynwood, Pretoria, 0087, South Africa\n\nOur team is available 24/7 to assist you with:\n• Reservations and booking inquiries\n• Special requests and arrangements\n• Event planning and group bookings\n• Concierge services\n• General inquiries\n\nWhether you're planning a romantic getaway, business trip, or special celebration, our dedicated team is here to ensure your stay is nothing short of exceptional. Contact us today and let us help you create unforgettable memories."
    },
    "Privacy & Cookies": {
      title: "Your Privacy Matters",
      content: "At Delta Hotel, we are committed to protecting your personal information and respecting your privacy. Our privacy policy outlines how we collect, use, store, and safeguard your data in accordance with South African privacy laws and international standards.\n\nWhat We Collect:\n• Personal identification information (name, email, phone number)\n• Booking and reservation details\n• Payment information (securely processed)\n• Website usage data and preferences\n\nHow We Use Your Information:\n• Process bookings and reservations\n• Provide personalized services\n• Communicate important updates\n• Improve our services and website experience\n• Comply with legal obligations\n\nCookies:\nWe use cookies to enhance your browsing experience, remember your preferences, and provide personalized content. You can manage cookie settings in your browser at any time.\n\nYour data security is our priority. We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure."
    }
  };

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

      {/* ---------- DESTINATIONS SECTION ---------- */}
      <section className={styles.destinationsSection}>
        <h2 className={styles.sectionTitle}>Destinations</h2>
        <DestinationsSection />
      </section>

      {/* ---------- ADDRESS SECTION ---------- */}
      <section className={styles.addressSection}>
        <h2 className={styles.sectionTitle}>Our Address</h2>
        <div className={styles.addressCard}>
          <div className={styles.mapPlaceholder}>
            <iframe
              title="Delta Hotel location"
              src="https://www.google.com/maps?q=1+Mark+Shuttleworth+Street,+Lynwood,+Pretoria,+0087,+South+Africa&hl=en&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
            />
          </div>
          <div className={styles.addressDetails}>
            <p>1 Mark Shuttleworth Street</p>
            <p>Lynwood, Pretoria</p>
            <p>0087, South Africa</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=1+Mark+Shuttleworth+Street,+Lynwood,+Pretoria,+0087,+South+Africa"
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
              <li 
                className={styles.footerLink}
                onMouseEnter={() => setHoveredLink("About Us")}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setOpenModal("About Us")}
              >
                About Us
                {hoveredLink === "About Us" && (
                  <div className={styles.linkOverlay}>
                    <h5 className={styles.overlayTitle}>{linkInfo["About Us"].title}</h5>
                    <p className={styles.overlayContent}>
                      Discover our story of luxury hospitality. Delta Hotel has been providing world-class accommodation and exceptional service since our establishment... <span className={styles.moreText}>more</span>
                    </p>
                  </div>
                )}
              </li>
              <li 
                className={styles.footerLink}
                onMouseEnter={() => setHoveredLink("Contact Us")}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setOpenModal("Contact Us")}
              >
                Contact Us
                {hoveredLink === "Contact Us" && (
                  <div className={styles.linkOverlay}>
                    <h5 className={styles.overlayTitle}>{linkInfo["Contact Us"].title}</h5>
                    <p className={styles.overlayContent}>
                      📧 Email: info@deltahotel.co.za<br/>
                      📞 Phone: +27 12 345 6789<br/>
                      📍 Address: 1 Mark Shuttleworth Street, Lynwood, Pretoria<br/>
                      <span className={styles.moreText}>...more</span>
                    </p>
                  </div>
                )}
              </li>
              <li className={styles.footerLinkNoHover}>Terms & Conditions</li>
              <li 
                className={styles.footerLink}
                onMouseEnter={() => setHoveredLink("Privacy & Cookies")}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setOpenModal("Privacy & Cookies")}
              >
                Privacy & Cookies
                {hoveredLink === "Privacy & Cookies" && (
                  <div className={styles.linkOverlay}>
                    <h5 className={styles.overlayTitle}>{linkInfo["Privacy & Cookies"].title}</h5>
                    <p className={styles.overlayContent}>
                      At Delta Hotel, we are committed to protecting your personal information and respecting your privacy. Our privacy policy outlines how we collect, use, store, and safeguard your data... <span className={styles.moreText}>more</span>
                    </p>
                  </div>
                )}
              </li>
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
            <p>1 Mark Shuttleworth Street</p>
            <p>Lynwood</p>
            <p>Pretoria, 0087</p>
            <p>South Africa</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 Delta Hotel. All rights reserved.</p>
        </div>
      </footer>

      {/* ---------- MODAL OVERLAY ---------- */}
      {openModal && (
        <div className={styles.modalBackdrop} onClick={() => setOpenModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseButton} 
              onClick={() => setOpenModal(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 className={styles.modalTitle}>{linkInfo[openModal].title}</h2>
            <div className={styles.modalBody}>
              <p style={{ whiteSpace: 'pre-line' }}>{linkInfo[openModal].content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingSections;

