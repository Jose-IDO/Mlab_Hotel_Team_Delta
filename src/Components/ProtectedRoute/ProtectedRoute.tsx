import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Add to your ProtectedRoute component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin) {
    const adminRoles = ['super_admin', 'hotel_manager'];
    const hasAdminRole = Array.isArray(user.roles)
      ? user.roles.some((r: any) => {
          const roleName = typeof r === 'string' ? r : r?.name;
          return adminRoles.includes(roleName);
        })
      : false;

    if (!hasAdminRole) {
      return <div>Access Denied: You need admin privileges</div>;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
