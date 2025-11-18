import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopiaContextType {
  isAccepted: boolean;
  acceptConsent: () => void;
  declineConsent: () => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
}

const PopiaContext = createContext<PopiaContextType | undefined>(undefined);

export const PopiaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true); // Show on each visit

  const acceptConsent = () => {
    setIsAccepted(true);
    setShowOverlay(false);
  };

  const declineConsent = () => {
    setIsAccepted(false);
    setShowOverlay(false);
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

