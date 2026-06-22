"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthResponse, User } from "@/lib/types";
import {
  apiRequest,
  ApiError,
  logout,
  refreshSession,
} from "@/lib/api/client";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (session: AuthResponse) => void;
  request: <T>(
    path: string,
    options?: RequestInit,
  ) => Promise<T>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "farm-commerce-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setStoredSession] = useState<AuthResponse | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored) as AuthResponse;
        setStoredSession(session);
        setUser(session.user);
        setAccessToken(session.accessToken);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  const setSession = useCallback((session: AuthResponse) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setStoredSession(session);
    setUser(session.user);
    setAccessToken(session.accessToken);
  }, []);

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setStoredSession(null);
    setUser(null);
    setAccessToken(null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (accessToken) await logout(accessToken);
    } catch {
      // An expired or already-revoked session is still locally signed out.
    } finally {
      clearSession();
    }
  }, [accessToken, clearSession]);

  const request = useCallback(
    async <T,>(path: string, options: RequestInit = {}) => {
      if (!accessToken) throw new ApiError("กรุณาเข้าสู่ระบบ", 401);
      try {
        return await apiRequest<T>(path, { ...options, token: accessToken });
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401 || !session) {
          throw error;
        }
        try {
          const refreshed = await refreshSession(session.refreshToken);
          setSession(refreshed);
          return await apiRequest<T>(path, {
            ...options,
            token: refreshed.accessToken,
          });
        } catch (refreshError) {
          clearSession();
          throw refreshError;
        }
      }
    },
    [accessToken, clearSession, session, setSession],
  );

  const value = useMemo(
    () => ({ user, accessToken, hydrated, setSession, request, signOut }),
    [accessToken, hydrated, request, setSession, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
