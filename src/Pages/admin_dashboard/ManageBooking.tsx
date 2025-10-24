import React from 'react'
import styles from "./ManageBooking.module.css";

export const ManageBooking = () => {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Manage Bookings</h1>
        
        {/* Pending Bookings */}
        <section className={styles.bookingSection}>
          <h3 className={styles.subtitle}>Pending Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#B1001</td>
                <td>John Doe</td>
                <td>Suite 201</td>
                <td>2025-11-01</td>
                <td>2025-11-05</td>
                <td><span className={styles.statusPending}>Pending</span></td>
                <td>
                  <button type="button" className={styles.approveBtn}>Approve</button>
                  <button type="button" className={styles.cancelBtn}>Cancel</button>
                </td>
              </tr>
              <tr>
                <td>#B1003</td>
                <td>Michael Brown</td>
                <td>Standard 305</td>
                <td>2025-11-07</td>
                <td>2025-11-10</td>
                <td><span className={styles.statusPending}>Pending</span></td>
                <td>
                  <button type="button" className={styles.approveBtn}>Approve</button>
                  <button type="button" className={styles.cancelBtn}>Cancel</button>
                </td>
              </tr>
              <tr>
                <td>#B1005</td>
                <td>David Lee</td>
                <td>Deluxe 110</td>
                <td>2025-11-08</td>
                <td>2025-11-12</td>
                <td><span className={styles.statusPending}>Pending</span></td>
                <td>
                  <button type="button" className={styles.approveBtn}>Approve</button>
                  <button type="button" className={styles.cancelBtn}>Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Confirmed Bookings */}
        <section className={styles.bookingSection}>
          <h3 className={styles.subtitle}>Confirmed Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#B1002</td>
                <td>Jane Smith</td>
                <td>Deluxe 102</td>
                <td>2025-11-03</td>
                <td>2025-11-06</td>
                <td><span className={styles.statusConfirmed}>Confirmed</span></td>
                <td>
                  <button type="button" className={styles.viewBtn}>View</button>
                  <button type="button" className={styles.cancelBtn}>Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Checked-in Bookings */}
        <section className={styles.bookingSection}>
          <h3 className={styles.subtitle}>Checked-in Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#B1004</td>
                <td>Lisa Green</td>
                <td>Suite 203</td>
                <td>2025-11-02</td>
                <td>2025-11-04</td>
                <td><span className={styles.statusCheckedIn}>Checked-in</span></td>
                <td>
                  <button type="button" className={styles.viewBtn}>View</button>
                  <button type="button" className={styles.checkoutBtn}>Checkout</button>
                </td>
              </tr>
              <tr>
                <td>#B1004</td>
                <td>Lisa Green</td>
                <td>Suite 203</td>
                <td>2025-11-02</td>
                <td>2025-11-04</td>
                <td><span className={styles.statusCheckedIn}>Checked-in</span></td>
                <td>
                  <button type="button" className={styles.viewBtn}>View</button>
                  <button type="button" className={styles.checkoutBtn}>Checkout</button>
                </td>
              </tr>
              <tr>
                <td>#B1004</td>
                <td>Lisa Green</td>
                <td>Suite 203</td>
                <td>2025-11-02</td>
                <td>2025-11-04</td>
                <td><span className={styles.statusCheckedIn}>Checked-in</span></td>
                <td>
                  <button type="button" className={styles.viewBtn}>View</button>
                  <button type="button" className={styles.checkoutBtn}>Checkout</button>
                </td>
              </tr>
              <tr>
                <td>#B1004</td>
                <td>Lisa Green</td>
                <td>Suite 203</td>
                <td>2025-11-02</td>
                <td>2025-11-04</td>
                <td><span className={styles.statusCheckedIn}>Checked-in</span></td>
                <td>
                  <button type="button" className={styles.viewBtn}>View</button>
                  <button type="button" className={styles.checkoutBtn}>Checkout</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
    </div>
  )
}
