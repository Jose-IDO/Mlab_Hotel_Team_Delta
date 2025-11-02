// BACKUP: This is the API-based authentication that was broken
// To restore: copy this file's content back to AuthContext.tsx
// The API_URL was undefined because no .env file exists with VITE_API_URL

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
  roles?: Array<{ name: string; displayName: string }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedUser = localStorage.getItem('hotel_user');
    const savedToken = localStorage.getItem('hotel_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return false;
      }

      const { user: userData, token: authToken } = data.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('hotel_user', JSON.stringify(userData));
      localStorage.setItem('hotel_token', authToken);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
      return false;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return false;
      }

      const { user: userData, token: authToken } = data.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('hotel_user', JSON.stringify(userData));
      localStorage.setItem('hotel_token', authToken);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotel_user');
    localStorage.removeItem('hotel_token');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

