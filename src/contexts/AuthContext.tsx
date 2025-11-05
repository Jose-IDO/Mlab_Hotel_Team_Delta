import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  loginUser, 
  signupUser, 
  logout as logoutAction,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../store/slices/authSlice';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  role?: 'customer' | 'admin';
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

// AuthProvider now wraps Redux state and actions
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      return !!result;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  const signup = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(signupUser({ firstName, lastName, email, phone, password })).unwrap();
      return !!result;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const value = useMemo(() => ({
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    error
  }), [user, token, login, signup, logout, isAuthenticated, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
