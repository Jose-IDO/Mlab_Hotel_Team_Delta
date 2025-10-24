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
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '40px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            textAlign: 'center'
                        }}>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '16px'
                            }}>Welcome to the Admin Dashboard</h1>
                            <p style={{
                                color: '#718096',
                                fontSize: '16px',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}>Select an option from the sidebar to get started managing your hotel.</p>
                        </div>
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
