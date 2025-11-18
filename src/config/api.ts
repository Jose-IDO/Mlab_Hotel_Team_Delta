const getApiUrl = () = {
   In production (GitHub Pages), use the Railway backend URL
  if (import.meta.env.PROD) {
    return 'http://mlabhotelteamdelta-production.up.railway.app';
  }
   In development, use environment variable or default
  return import.meta.env.VITE_API_URL  'httplocalhost4000';
};

export const API_URL = getApiUrl();
