import React from 'react'
import { Routes, Route } from 'react-router-dom';
import styles from "./AdminDashboard.module.css";
import { AdminNavbar } from '../../Components/AdminNavbar/AdminNavbar';
import { AdminSidebar } from '../../Components/AdminSidebar/AdminSidebar';
import { ManageBooking } from './ManageBooking';
import { ManageAccom } from './ManageAccom';
import { Administrators } from './Administrators';

export const AdminDashboard = () => {
  return (
    <div>
        <div className={styles.navbar}>
            <AdminNavbar />
        </div>
        <div className={styles.pageContent}>
            <div className={styles.sidebar}>
                <AdminSidebar />
            </div>
            <div className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={
                        <>
                            <h1>Welcome to the Admin Dashboard</h1>
                            <p>Select an option from the sidebar to get started.</p>
                        </>
                    } />
                    <Route path="/admin/bookings" element={<ManageBooking />} />
                    <Route path="/admin/accommodations" element={<ManageAccom />} />
                    <Route path="/admin/stats" element={<h1>View Stats/Reports</h1>} />
                    <Route path="/admin/administrators" element={<Administrators />} />
                </Routes>
            </div>
        </div>
    </div>
  )
}
