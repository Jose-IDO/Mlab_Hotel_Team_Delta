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
        <Link to="/admin/accommodations">
          <span></span>
          Manage Accommodation
        </Link>
      </li>
      <li>
        <Link to="/admin/stats">
          <span></span>
          View Stats/Reports
        </Link>
      </li>
      <li>
        <Link to="/admin/administrators">
          <span></span>
          Administrators
        </Link>
      </li>
    </ul>
  )
}
