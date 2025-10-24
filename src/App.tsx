import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { Navbar } from "./Components/Navbar/Navbar"
import { LandingPage } from "./Pages/Landing_Page/LandingPage"
import { AdminDashboard } from "./Pages/admin_dashboard/AdminDashboard"
import { ProtectedRoute } from "./Components/ProtectedRoute"

const App = () => {
  const basename = import.meta.env.PROD ? '/Mlab_Hotel_Team_Delta' : ''
  
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
