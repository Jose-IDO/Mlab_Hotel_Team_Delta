import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface PopiaContextType {
  isAccepted: boolean;
  acceptConsent: () => void;
  declineConsent: () => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
}

const PopiaContext = createContext<PopiaContextType | undefined>(undefined);

export const PopiaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load acceptance status from localStorage
  const [isAccepted, setIsAccepted] = useState(() => {
    const stored = localStorage.getItem('popia_accepted');
    return stored === 'true';
  });
  
  // Only show overlay if not accepted
  const [showOverlay, setShowOverlay] = useState(() => {
    const stored = localStorage.getItem('popia_accepted');
    return stored !== 'true';
  });

  const acceptConsent = () => {
    setIsAccepted(true);
    setShowOverlay(false);
    localStorage.setItem('popia_accepted', 'true');
  };

  const declineConsent = () => {
    setIsAccepted(false);
    setShowOverlay(false);
    localStorage.setItem('popia_accepted', 'false');
  };

  return (
    <PopiaContext.Provider
      value={{
        isAccepted,
        acceptConsent,
        declineConsent,
        showOverlay,
        setShowOverlay,
      }}
    >
      {children}
    </PopiaContext.Provider>
  );
};

export const usePopia = () => {
  const context = useContext(PopiaContext);
  if (context === undefined) {
    throw new Error('usePopia must be used within a PopiaProvider');
  }
  return context;
};

