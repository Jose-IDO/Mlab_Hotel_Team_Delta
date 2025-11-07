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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert("Title, date, and description are required!");
      return;
    }

    // For new events, require image
    if (!editingId && !newEvent.file) {
      alert("Image is required for new events!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("date", newEvent.date);
    formData.append("description", newEvent.description);
    if (newEvent.file) formData.append("image", newEvent.file);

    setSubmitting(true);
    try {
      let res;
      if (editingId) {
        // Update existing event
        res = await fetch(`${API_URL}/admin/events/${editingId}`, { 
          method: "PUT", 
          body: formData 
        });
      } else {
        // Create new event
        res = await fetch(`${API_URL}/admin/events`, { 
          method: "POST", 
          body: formData 
        });
      }
      
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || `Failed to ${editingId ? 'update' : 'create'} event`);
      
      setNewEvent({ title: "", date: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setNewEvent({
      title: event.title,
      date: event.date,
      description: event.description,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewEvent({ title: "", date: "", description: "" });
    setShowForm(false);
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
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <h2 className={styles.title}>Manage Events</h2>
        <button 
          className={styles.addButton}
          onClick={() => showForm ? handleCancelEdit() : setShowForm(true)}
        >
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add new event form */}
      {showForm && (
        <div className={styles.formSection}>
          <h3 className={styles.subtitle}>{editingId ? 'Edit Event' : 'Add New Event'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Title</label>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Enter event title" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Date</label>
              <input 
                type="date" 
                className={styles.input}
                value={newEvent.date} 
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
              />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                placeholder="Enter event description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>
                Event Image {editingId && <span style={{ color: '#666', fontWeight: 'normal' }}>(Leave empty to keep current image)</span>}
              </label>
              <input 
                type="file" 
                className={styles.fileInput}
                accept="image/*" 
                onChange={(e) => e.target.files && setNewEvent({ ...newEvent, file: e.target.files[0] })} 
              />
            </div>
          </div>
          <button 
            className={styles.submitButton}
            onClick={addEvent} 
            disabled={submitting}
          >
            {submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Event" : "Add Event")}
          </button>
        </div>
      )}

      {/* List of events */}
      <div className={styles.section}>
        <h3 className={styles.subtitle}>Existing Events ({events.length})</h3>
        {loading && <div className={styles.loadingText}>Loading events…</div>}
        {error && <div className={styles.errorText}>{error}</div>}
        {!loading && events.length === 0 && <div className={styles.emptyText}>No events found.</div>}
        
        {!loading && events.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.imageUrl ? (
                      <img 
                        src={`${API_URL}/uploads/${e.imageUrl}`} 
                        alt={e.title} 
                        className={styles.eventImage}
                      />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </td>
                  <td className={styles.eventTitle}>{e.title}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td className={styles.description}>{e.description}</td>
                  <td>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => deleteEvent(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};