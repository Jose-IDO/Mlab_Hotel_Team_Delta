import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePopia } from '../../contexts/PopiaContext';

interface PopiaRouteGuardProps {
  children: React.ReactNode;
}

const PopiaRouteGuard: React.FC<PopiaRouteGuardProps> = ({ children }) => {
  const { isAccepted, setShowOverlay } = usePopia();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user tries to access signin/signup without accepting POPIA, show overlay and redirect
    if (!isAccepted && (location.pathname === '/signin' || location.pathname === '/signup')) {
      setShowOverlay(true);
      navigate('/');
    }
  }, [isAccepted, location.pathname, navigate, setShowOverlay]);

  // If not accepted, don't render the protected route
  if (!isAccepted && (location.pathname === '/signin' || location.pathname === '/signup')) {
    return null;
  }

  return <>{children}</>;
};

export default PopiaRouteGuard;

