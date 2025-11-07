import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket";
import styles from "./Notifications.module.css";

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        });
        const data = await res.json();
        if(data.ok) setNotifications(data.data);
      } catch(err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    socket.on("newBooking", (data) => {
      // Ensure `data` has booking object + message
      const notif = {
        message: data.message,
        booking: data.booking
      };
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      socket.off("newBooking");
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n, idx) => (
            <li key={idx} className={styles.item}>
              <strong>{n.message}</strong>
              {n.booking && (
                <div className={styles.bookingInfo}>
                  Room: {n.booking.roomNumber ?? n.booking.roomId} | 
                  User: {n.booking.userId}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
