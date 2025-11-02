import styles from "./ManageBooking.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "checked-in";
type Booking = {
  id: string;
  guest: string; // display name or userId fallback
  room: string;  // display room name or roomId fallback
  checkIn: string;   // ISO
  checkOut: string;  // ISO
  status: BookingStatus;
};

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const className =
    status === "pending"
      ? styles.statusPending
      : status === "confirmed"
      ? styles.statusConfirmed
      : status === "cancelled"
      ? styles.statusCancelled
      : styles.statusCheckedIn;
  const label =
    status === "pending"
      ? "Pending"
      : status === "confirmed"
      ? "Confirmed"
      : status === "cancelled"
      ? "Cancelled"
      : "Checked-in";
  return <span className={className}>{label}</span>;
};

const BookingTable = ({
  title,
  data,
  onApprove,
  onCancel,
  onView,
  onCheckout,
  onCheckin, // NEW
}: {
  title: string;
  data: Booking[];
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
  onView: (id: string) => void;
  onCheckout: (id: string) => void;
  onCheckin: (id: string) => void; // NEW
}) => (
        <section className={styles.bookingSection}>
    <h3 className={styles.subtitle}>{title}</h3>
    <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
            <th scope="col">Booking ID</th>
            <th scope="col">Guest Name</th>
            <th scope="col">Room</th>
            <th scope="col">Check-in</th>
            <th scope="col">Check-out</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
                No records found.
                </td>
              </tr>
          ) : (
            data.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.guest}</td>
                <td>{b.room}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  {b.status === "pending" && (
                    <>
                      <button type="button" className={styles.approveBtn} aria-label={`Approve ${b.id}`} onClick={() => onApprove(b.id)}>Approve</button>
                      <button type="button" className={styles.cancelBtn} aria-label={`Cancel ${b.id}`} onClick={() => onCancel(b.id)}>Cancel</button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <>
                      <button type="button" className={styles.viewBtn} aria-label={`View ${b.id}`} onClick={() => onView(b.id)}>View</button>
                      <button type="button" className={styles.checkinBtn} aria-label={`Check-in ${b.id}`} onClick={() => onCheckin(b.id)}>Check-in</button>
                      <button type="button" className={styles.cancelBtn} aria-label={`Cancel ${b.id}`} onClick={() => onCancel(b.id)}>Cancel</button>
                    </>
                  )}
                  {b.status === "checked-in" && (
                    <>
                      <button type="button" className={styles.viewBtn} aria-label={`View ${b.id}`} onClick={() => onView(b.id)}>View</button>
                      <button type="button" className={styles.checkoutBtn} aria-label={`Checkout ${b.id}`} onClick={() => onCheckout(b.id)}>Checkout</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
            </tbody>
          </table>
    </div>
        </section>
);

export const ManageBooking = () => {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | BookingStatus>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/bookings/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Check content type before parsing
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned ${contentType} instead of JSON. Server might be down or misconfigured.`);
      }
      
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "Failed to load bookings");
      const list = (data.data || data).map((b: any) => ({
        id: b.id,
        guest: b.guestName || `${b.guestEmail || 'Unknown'}`,
        room: b.roomName || b.roomType || `Room ${b.roomId || '-'}`,
        checkIn: b.checkIn || b.check_in,
        checkOut: b.checkOut || b.check_out,
        status: (b.status as BookingStatus) || "pending",
      })) as Booking[];
      setBookings(list);
    } catch (e: any) {
      console.error('Error loading bookings:', e);
      setError(e.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesQuery =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.guest.toLowerCase().includes(q) ||
        b.room.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, statusFilter]);

  const pending = filtered.filter((b) => b.status === "pending");
  const confirmed = filtered.filter((b) => b.status === "confirmed");
  // const checkedIn = filtered.filter((b) => b.status === "checked-in");

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || "Failed to update status");
      // Refresh list
      loadBookings();
    } catch (e) {
      alert((e as any).message || "Failed to update booking");
    }
  };

  const handleApprove = (id: string) => {
    if (confirm(`Approve booking ${id}?`)) {
      updateStatus(id, "confirmed");
    }
  };
  const handleCancel = (id: string) => {
    if (confirm(`Cancel booking ${id}?`)) {
      updateStatus(id, "cancelled");
    }
  };
  const handleView = (id: string) => {
    // TODO: open details drawer/modal
    console.log("View", id);
  };
  const handleCheckin = (id: string) => {
    if (confirm(`Check-in guest for booking ${id}?`)) {
      // TODO: call API to change status from confirmed -> checked-in
      console.log("Checked in", id);
    }
  };
  const handleCheckout = (id: string) => {
    if (confirm(`Checkout booking ${id}?`)) {
      // TODO: call API to complete booking
      console.log("Checked out", id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Bookings</h1>
        <div className={styles.actionsRow}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by ID, guest, room..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className={styles.bookingSection}>
          <p>Loading bookings…</p>
        </div>
      )}
      {error && (
        <div className={styles.bookingSection}>
          <p style={{ color: '#b91c1c' }}>Error: {error}</p>
        </div>
      )}

      <BookingTable
        title="Pending Bookings"
        data={pending}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onView={handleView}
        onCheckout={handleCheckout}
        onCheckin={handleCheckin}
      />
      <BookingTable
        title="Confirmed Bookings"
        data={confirmed}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onView={handleView}
        onCheckout={handleCheckout}
        onCheckin={handleCheckin}
      />
      <BookingTable
        title="Cancelled Bookings"
        data={filtered.filter((b) => b.status === "cancelled")}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onView={handleView}
        onCheckout={handleCheckout}
        onCheckin={handleCheckin}
      />
    </div>
  );
};
