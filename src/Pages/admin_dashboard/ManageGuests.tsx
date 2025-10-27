import React, { useMemo, useState } from "react";
import styles from "./ManageGuests.module.css";

type GuestStatus = "Active" | "Blocked" | "Pending";

type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastStay: string; // ISO or display date
  status: GuestStatus;
};

const sampleGuests: Guest[] = [
  { id: "G1001", name: "Alex Johnson", email: "alex.j@example.com", phone: "+1 555 0234", totalBookings: 6, lastStay: "2025-08-14", status: "Active" },
  { id: "G1002", name: "Priya Patel", email: "priya.p@example.com", phone: "+44 20 7123 9876", totalBookings: 2, lastStay: "2025-07-01", status: "Pending" },
  { id: "G1003", name: "Chen Wei", email: "chen.w@example.com", phone: "+86 21 1234 5678", totalBookings: 10, lastStay: "2025-09-28", status: "Active" },
  { id: "G1004", name: "Maria Garcia", email: "maria.g@example.com", phone: "+34 91 123 4567", totalBookings: 1, lastStay: "2024-12-04", status: "Blocked" }
];

export const ManageGuests: React.FC = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | GuestStatus>("");
  const [data, setData] = useState<Guest[]>(sampleGuests);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.filter(g => {
      const matchesQ =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q);
      const matchesStatus = !status || g.status === status;
      return matchesQ && matchesStatus;
    });
  }, [query, status, data]);

  const toggleBlock = (id: string) => {
    setData(prev =>
      prev.map(g =>
        g.id === id ? { ...g, status: g.status === "Blocked" ? "Active" : "Blocked" } : g
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Guests</h1>
        <div className={styles.actionsRow}>
          <input
            className={styles.searchInput}
            placeholder="Search by name, email, phone, or ID..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.subtitle}>Guest Directory</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Guest ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Bookings</th>
                <th>Last Stay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td className={styles.truncate}>{g.name}</td>
                  <td className={styles.truncate}>{g.email}</td>
                  <td className={styles.truncate}>{g.phone}</td>
                  <td className={styles.numeric}>{g.totalBookings}</td>
                  <td>{new Date(g.lastStay).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        g.status === "Active"
                          ? styles.statusActive
                          : g.status === "Pending"
                          ? styles.statusPending
                          : styles.statusBlocked
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className={styles.nowrap}>
                    <button className={styles.viewBtn}>View</button>
                    <button className={styles.editBtn}>Edit</button>
                    <button
                      className={g.status === "Blocked" ? styles.restoreBtn : styles.deactivateBtn}
                      onClick={() => toggleBlock(g.id)}
                    >
                      {g.status === "Blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#4a5568" }}>
                    No guests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};