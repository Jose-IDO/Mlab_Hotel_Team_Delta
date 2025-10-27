import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LandingPage } from './Pages/Landing_Page/LandingPage';
import { AdminDashboard } from './Pages/admin_dashboard/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { Navbar } from './Components/Navbar/Navbar';

function App() {
  const basename = import.meta.env.PROD ? '/Mlab_Hotel_Team_Delta' : ''

  return (
    <AuthProvider>
      <Router basename={basename}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
