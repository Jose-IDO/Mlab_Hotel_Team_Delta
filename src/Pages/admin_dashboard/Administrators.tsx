import React from 'react';
import styles from './Administrators.module.css';

export const Administrators: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Administrators</h1>
        <button className={styles.addButton}>+ Add New</button>
      </div>

      {/* Active Administrators */}
      <section className={styles.adminSection}>
        <h3 className={styles.subtitle}>Active Administrators</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin ID</th>
              <th>Admin Name</th>
              <th>Email</th>
              <th>Admin Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#AD001</td>
              <td>John Smith</td>
              <td>john.smith@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.superAdmin}`}>Super Admin</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deactivateBtn}>Deactivate</button>
              </td>
            </tr>
            <tr>
              <td>#AD002</td>
              <td>Sarah Johnson</td>
              <td>sarah.johnson@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.admin}`}>Admin</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deactivateBtn}>Deactivate</button>
              </td>
            </tr>
            <tr>
              <td>#AD003</td>
              <td>Michael Brown</td>
              <td>michael.brown@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.moderator}`}>Moderator</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deactivateBtn}>Deactivate</button>
              </td>
            </tr>
            <tr>
              <td>#AD004</td>
              <td>Emily Davis</td>
              <td>emily.davis@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.admin}`}>Admin</span></td>
              <td>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deactivateBtn}>Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Admin Requests */}
      <section className={styles.adminSection}>
        <h3 className={styles.subtitle}>Admin Requests</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Requested Role</th>
              <th>Date Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#REQ001</td>
              <td>David Wilson</td>
              <td>david.wilson@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.admin}`}>Admin</span></td>
              <td>2025-10-20</td>
              <td>
                <button className={styles.approveBtn}>Approve</button>
                <button className={styles.rejectBtn}>Reject</button>
              </td>
            </tr>
            <tr>
              <td>#REQ002</td>
              <td>Jennifer Lee</td>
              <td>jennifer.lee@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.moderator}`}>Moderator</span></td>
              <td>2025-10-21</td>
              <td>
                <button className={styles.approveBtn}>Approve</button>
                <button className={styles.rejectBtn}>Reject</button>
              </td>
            </tr>
            <tr>
              <td>#REQ003</td>
              <td>Robert Taylor</td>
              <td>robert.taylor@deltahotel.com</td>
              <td><span className={`${styles.typeBadge} ${styles.admin}`}>Admin</span></td>
              <td>2025-10-22</td>
              <td>
                <button className={styles.approveBtn}>Approve</button>
                <button className={styles.rejectBtn}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};