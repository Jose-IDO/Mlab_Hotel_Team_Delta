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

  console.log('🔒 ProtectedRoute Check:', {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
    userRoles: user?.roles,
    requireAdmin,
    currentPath: window.location.pathname
  });

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    console.log('❌ No user - redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin) {
    const adminRoles = ['super_admin', 'hotel_manager'];
    // Support roles as objects or strings just in case
    const hasAdminRole = Array.isArray(user.roles)
      ? user.roles.some((r: any) => {
          const roleName = typeof r === 'string' ? r : r?.name;
          return adminRoles.includes(roleName);
        })
      : false;
    
    console.log('🔑 Admin Check:', {
      hasAdminRole,
      userRoles: user.roles?.map(r => r.name),
      requiredRoles: adminRoles
    });

    if (!hasAdminRole) {
      console.log('❌ Access denied - no admin role');
      return <div>Access Denied: You need admin privileges</div>;
    }
    
    console.log('✅ Admin access granted');
  }

  return <>{children}</>;
};

export default ProtectedRoute;
