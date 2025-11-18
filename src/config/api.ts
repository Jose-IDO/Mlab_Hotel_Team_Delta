const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://mlabhotelteamdelta-production.up.railway.app';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:4000';
};

export const API_URL = getApiUrl();
