import { Link } from 'react-router-dom';

export const AdminSidebar = () => {
  return (
    <ul>
      <li>
        <Link to="/admin/bookings">
          <span></span>
          Manage Bookings
        </Link>
      </li>
      <li>
        <Link to="/admin/rooms">
          <span></span>
          Manage Rooms
        </Link>
      </li>
      <li>
        <Link to="/admin/guests">
          <span></span>
          Manage Guests
        </Link>
      </li>
      <li>
        <Link to="/admin/deals">
          <span></span>
          Manage Deals
        </Link>
      </li>
      {/* <li>
        <Link to="/admin/stats">
          <span></span>
          View Stats/Reports
        </Link>
      </li> */}
      <li>
        <Link to="/admin/calendar">
          <span></span>
          Availability Calendar
        </Link>
      </li>
      <li>
        <Link to="/admin/events">
          <span></span>
          Manage Events
        </Link>
      </li>
      <li>
        <Link to="/admin/administrators">
          <span></span>
          Administrators
        </Link>
      </li>
      <li>
        <Link to="/admin/settings">
          <span></span>
          Settings
        </Link>
      </li>
    </ul>
  )
}
