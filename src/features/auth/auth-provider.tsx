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

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (session: AuthResponse) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "farm-commerce-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored) as AuthResponse;
        setUser(session.user);
        setAccessToken(session.accessToken);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  const setSession = useCallback((session: AuthResponse) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session.user);
    setAccessToken(session.accessToken);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, hydrated, setSession, signOut }),
    [accessToken, hydrated, setSession, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
