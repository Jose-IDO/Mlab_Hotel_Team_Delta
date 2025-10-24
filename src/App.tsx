import { BrowserRouter } from "react-router"
import { Navbar } from "./Components/Navbar/Navbar"
import { LandingPage } from "./Pages/Landing_Page/LandingPage"
import { AdminDashboard } from "./Pages/admin_dashboard/AdminDashboard"

const App = () => {
  return (
  <BrowserRouter>
    <div>
      <Navbar />
      <LandingPage/>
      <AdminDashboard />
    </div>
  </BrowserRouter>
  )
}

export default App
