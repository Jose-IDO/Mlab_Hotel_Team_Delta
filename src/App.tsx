import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './Pages/Landing_Page/LandingPage';
import { AdminDashboard } from './Pages/admin_dashboard/AdminDashboard';
import { CustomerDashboard } from './Pages/Customer_Dashboard/CustomerDashboard';
import SignIn from './Pages/Auth/SignIn';
import SignUp from './Pages/Auth/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute';
import { Navbar } from './Components/Navbar/Navbar';

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
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
  const basename = import.meta.env.PROD ? '/Mlab_Hotel_Team_Delta' : ''

  return (
    <AuthProvider>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
