import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Safely get initial state from localStorage
const getInitialUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('hotel_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem('hotel_token'),
  isAuthenticated: !!localStorage.getItem('hotel_token'),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return rejectWithValue(data.error || 'Login failed');
      }

      // Extract user and token from data.data (API format: { ok: true, data: { user, token } })
      const userData = data.data || data;
      const user = userData.user;
      const token = userData.token;

      if (!user || !token) {
        return rejectWithValue('Invalid response from server');
      }

      // Store in localStorage
      localStorage.setItem('hotel_token', token);
      localStorage.setItem('hotel_user', JSON.stringify(user));

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (
    { firstName, lastName, email, password, phone }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return rejectWithValue(data.error || 'Signup failed');
      }

      // Extract user and token from data.data (API format: { ok: true, data: { user, token } })
      const userData = data.data || data;
      const user = userData.user;
      const token = userData.token;

      if (!user || !token) {
        return rejectWithValue('Invalid response from server');
      }

      // Store in localStorage
      localStorage.setItem('hotel_token', token);
      localStorage.setItem('hotel_user', JSON.stringify(user));

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('hotel_token');
      localStorage.removeItem('hotel_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('hotel_user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

