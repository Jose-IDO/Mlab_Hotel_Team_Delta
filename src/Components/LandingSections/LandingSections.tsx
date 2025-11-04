// src/Components/LandingSections/LandingSections.tsx
import React, { useEffect, useState } from "react";
import styles from "./LandingSections.module.css";

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
    </div>
  );
};

export default LandingSections;
