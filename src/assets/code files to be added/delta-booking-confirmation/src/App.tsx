import BookingConfirmation from './BookingConfirmation'
import Home from './Home'

// Simple path-based rendering: /home shows Home, otherwise BookingConfirmation
export default function App() {
  const path = window.location.pathname;
  if (path === '/home') return <Home />;
  return <BookingConfirmation />;
}
