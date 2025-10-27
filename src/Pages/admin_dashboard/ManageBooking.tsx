import styles from "./ManageBooking.module.css";
import { useMemo, useState } from "react";

type BookingStatus = "pending" | "confirmed" | "checked-in";
type Booking = {
  id: string;
  guest: string;
  room: string;
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
      : styles.statusCheckedIn;
  const label =
    status === "pending" ? "Pending" : status === "confirmed" ? "Confirmed" : "Checked-in";
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | BookingStatus>("");

  const bookings: Booking[] = [
    { id: "#B1001", guest: "John Doe",    room: "Suite 201",    checkIn: "2025-11-01", checkOut: "2025-11-05", status: "pending" },
    { id: "#B1003", guest: "Michael Brown", room: "Standard 305", checkIn: "2025-11-07", checkOut: "2025-11-10", status: "pending" },
    { id: "#B1005", guest: "David Lee",   room: "Deluxe 110",   checkIn: "2025-11-08", checkOut: "2025-11-12", status: "pending" },
    { id: "#B1002", guest: "Jane Smith",  room: "Deluxe 102",   checkIn: "2025-11-03", checkOut: "2025-11-06", status: "confirmed" },
    { id: "#B1004", guest: "Lisa Green",  room: "Suite 203",    checkIn: "2025-11-02", checkOut: "2025-11-04", status: "checked-in" },
  ];

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
  const checkedIn = filtered.filter((b) => b.status === "checked-in");

  const handleApprove = (id: string) => {
    if (confirm(`Approve booking ${id}?`)) {
      // TODO: call API to change status from pending -> confirmed
      console.log("Approved", id);
    }
  };
  const handleCancel = (id: string) => {
    if (confirm(`Cancel booking ${id}?`)) {
      // TODO: call API to cancel booking
      console.log("Cancelled", id);
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
            <option value="checked-in">Checked-in</option>
          </select>
        </div>
      </div>

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
        title="Checked-in Bookings"
        data={checkedIn}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onView={handleView}
        onCheckout={handleCheckout}
        onCheckin={handleCheckin}
      />
    </div>
  );
};
