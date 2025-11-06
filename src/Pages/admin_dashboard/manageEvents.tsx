import React, { useEffect, useState } from "react";
import styles from "./ManageEvents.module.css";

type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
};

export const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState<{ title: string; date: string; description: string; file?: File }>({
    title: "",
    date: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/events`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to fetch events");
      setEvents(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.description || !newEvent.file) {
      alert("All fields are required including image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("date", newEvent.date);
    formData.append("description", newEvent.description);
    if (newEvent.file) formData.append("image", newEvent.file);

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/admin/events`, { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to create event");
      setNewEvent({ title: "", date: "", description: "" });
      fetchEvents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to delete event");
      fetchEvents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Events</h2>

      {/* Add new event */}
      <div className={styles.addEventForm}>
        <h3>Add New Event</h3>
        <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
        <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewEvent({ ...newEvent, file: e.target.files[0] })} />
        <button onClick={addEvent} disabled={submitting}>{submitting ? "Adding..." : "Add Event"}</button>
      </div>

      {/* List of events */}
      <div className={styles.eventsList}>
        <h3>Existing Events</h3>
        {loading && <div>Loading events…</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && events.length === 0 && <div>No events found.</div>}
        {events.map((e) => (
          <div key={e.id} className={styles.eventCard}>
            {e.imageUrl && <img src={`${API_URL}/uploads/${e.imageUrl}`} alt={e.title} className={styles.eventImage} />}
            <div className={styles.eventInfo}>
              <strong>{e.title}</strong> | {new Date(e.date).toLocaleDateString()}
              <p>{e.description}</p>
            </div>
            <div className={styles.eventActions}>
              <button onClick={() => deleteEvent(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};