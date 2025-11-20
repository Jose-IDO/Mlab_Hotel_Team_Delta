import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config/api";

export type FavoriteItem = {
  id: string;           // "hotel" | room.id
  type: "hotel" | "room";
  name: string;
  price?: number;       // only for rooms
  image?: string;       // only for rooms
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loading: boolean;
  error: string | null;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_KEY = "hotel_favorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage:", e);
      }
    }
  }, []);

  const fetchFavoritesFromBackend = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.data) {
          const backendFavorites = data.data.favorites || [];
          setFavorites(backendFavorites);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(backendFavorites));
        }
      } else {
        // If endpoint doesn't exist yet, fall back to localStorage
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            setFavorites(JSON.parse(raw));
          } catch (e) {
            console.error("Failed to parse favorites:", e);
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch favorites from backend:", err);
      // Fall back to localStorage
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          setFavorites(JSON.parse(raw));
        } catch (e) {
          console.error("Failed to parse favorites:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Sync with backend if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavoritesFromBackend();
    }
  }, [isAuthenticated, token, fetchFavoritesFromBackend]);

  const syncToBackend = useCallback(async (favoritesList: FavoriteItem[]) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(`${API_URL}/users/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorites: favoritesList }),
      });

      if (!response.ok) {
        // If endpoint doesn't exist yet, that's okay - we'll still use localStorage
        console.warn("Favorites API endpoint not available, using localStorage only");
      }
    } catch (err) {
      // Silently fail - localStorage is the fallback
      console.warn("Failed to sync favorites to backend:", err);
    }
  }, [isAuthenticated, token]);

  const toggleFavorite = useCallback(async (item: FavoriteItem) => {
    setLoading(true);
    setError(null);

    try {
      setFavorites((prevFavorites) => {
        const newFavorites = prevFavorites.some((f) => f.id === item.id)
          ? prevFavorites.filter((f) => f.id !== item.id)
          : [...prevFavorites, item];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));

        // Sync to backend
        syncToBackend(newFavorites);

        return newFavorites;
      });
    } catch (err: any) {
      setError(err.message || "Failed to update favorites");
    } finally {
      setLoading(false);
    }
  }, [syncToBackend]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading, error }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};

