import { Routes, Route } from 'react-router-dom';
import styles from "./AdminDashboard.module.css";
import { AdminNavbar } from '../../Components/AdminNavbar/AdminNavbar';
import { AdminSidebar } from '../../Components/AdminSidebar/AdminSidebar';
import { ManageBooking } from './ManageBooking';
import { ManageRooms } from './ManageRooms';
import { Administrators } from './Administrators';
import { Settings } from './Settings';
import { ManageGuests } from './ManageGuests';
import { AvailabilityCalendar } from './AvailabilityCalendar';

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
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            borderRadius: '16px',
                            padding: '40px',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #0093E9 0%, #00B4DB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '16px'
                            }}>Welcome to the Admin Dashboard</h1>
                            <p style={{
                                color: '#4a5568',
                                fontSize: '16px',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}>Select an option from the sidebar to get started managing your hotel.</p>
                        </div>
                    } />
                    <Route path="/bookings" element={<ManageBooking />} />
                    <Route path="/rooms" element={<ManageRooms />} />
                    <Route path="/guests" element={<ManageGuests />} />
                    {/* <Route path="/payments" element={<h1>Payments & Invoices</h1>} />
                    <Route path="/reviews" element={<h1>Reviews & Ratings</h1>} />
                    <Route path="/staff" element={<h1>Staff Management</h1>} />
                    <Route path="/housekeeping" element={<h1>Housekeeping</h1>} />
                    <Route path="/inventory" element={<h1>Inventory Management</h1>} />
                    <Route path="/promotions" element={<h1>Promotions & Discounts</h1>} />
                    <Route path="/calendar" element={<h1>Availability Calendar</h1>} />
                    <Route path="/stats" element={<h1>View Stats/Reports</h1>} />
                    <Route path="/notifications" element={<h1>Notifications</h1>} /> */}
                    <Route path="/administrators" element={<Administrators />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<AvailabilityCalendar />} />
                </Routes>
            </div>
        </div>
    </div>
  )
}
