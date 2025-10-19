"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; name: string; email: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  setSession: (token: string, user: NonNullable<User>) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
  hydrated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = localStorage.getItem('tt_access_token');
    const u = localStorage.getItem('tt_user');
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }
    setHydrated(true);
  }, []);

  const setSession = useCallback((newToken: string, newUser: NonNullable<User>) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tt_access_token', newToken);
      localStorage.setItem('tt_user', JSON.stringify(newUser));
    }
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tt_access_token');
      localStorage.removeItem('tt_user');
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    setSession,
    clearSession,
    isAuthenticated: Boolean(user && token),
    hydrated,
  }), [user, token, setSession, clearSession, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


