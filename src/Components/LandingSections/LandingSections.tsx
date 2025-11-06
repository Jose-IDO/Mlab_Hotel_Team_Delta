// src/Components/LandingSections/LandingSections.tsx
import React, { useEffect, useState } from "react";
import styles from "./LandingSections.module.css";
import { DestinationsSection } from "../DestinationsSection/DestinationsSection";
type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl?: string; // frontend-friendly URL
};

const LandingSections: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL; // e.g., http://localhost:3000

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/admin/events`);
      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to fetch events");
      }

      // Map DB snake_case to camelCase & prepend uploads path
      const mappedEvents = json.data.map((ev: any) => ({
        ...ev,
        imageUrl: ev.image_url ? `uploads/${ev.image_url}` : undefined,
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className={styles.landingSections}>
      {/* ---------- UPCOMING EVENTS ---------- */}
      <section className={styles.upcomingSection}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>

        {loading && <div>Loading events…</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <div className={styles.eventsGrid}>
          {!loading && events.length === 0 && <div>No upcoming events.</div>}

          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              {event.imageUrl && (
                <div className={styles.eventImagePlaceholder}>
                  <img
                    src={`${API_URL}/${event.imageUrl}`}
                    alt={event.title}
                    className={styles.eventImage}
                  />
                </div>
              )}

              <div className={styles.eventDetails}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className={styles.eventDescription}>{event.description}</p>
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
    </div>
  );
};

export default LandingSections;
