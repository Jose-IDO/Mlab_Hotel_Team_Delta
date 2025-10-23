import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from "./Pages/admin_dashboard/AdminDashboard"

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <AdminDashboard />
      </div>
    </BrowserRouter>
  )
}

export default App
