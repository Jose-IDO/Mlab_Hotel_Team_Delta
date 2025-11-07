import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css';

import { LandingPage } from './Pages/Landing_Page/LandingPage';
import { AdminDashboard } from './Pages/admin_dashboard/AdminDashboard';
import { CustomerDashboard } from './Pages/Customer_Dashboard/CustomerDashboard';
import SignIn from './Pages/Auth/SignIn';
import SignUp from './Pages/Auth/SignUp';
import OAuthCallback from './Pages/Auth/OAuthCallback';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute';
import { Navbar } from './Components/Navbar/Navbar';
import RoomDetails from "./Pages/Room_Details/RoomDetails";
import HotelDetails from "./Pages/HotelDetails/HotelDetails";

// Import BookingPage from the correct folder
import BookingPage from './Pages/Booking_Page/BookingPage';
import PaymentPage from './Pages/Payment/PaymentPage';
import BookingConfirmation from './Pages/BookingConfirmation/BookingConfirmation';
import UserProfile from './Pages/UserProfile/UserProfile';
import { Notifications } from './Pages/Notification/Notifications';


function AppContent() {
  const location = useLocation();
  // Only show the public Navbar on the landing page
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/hotel-details" element={<HotelDetails />} />
        <Route path="/room-details/:id" element={<RoomDetails />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Protected Booking Flow */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        
        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Customer Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/rooms" element={<CustomerDashboard />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const basename = import.meta.env.PROD ? '/Mlab_Hotel_Team_Delta' : '';
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router basename={basename}>
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;