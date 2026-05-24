"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "./api";
import type { ApiUser } from "./api-types";

const TOKEN_KEY = "auth_token";

interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(u: ApiUser): AuthUser {
  return { id: u.id, email: u.email, username: u.username, role: u.role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setToken(stored);
    api
      .getMe()
      .then((u) => setUser(toAuthUser(u)))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const me = await api.getMe();
    setUser(toAuthUser(me));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === "admin",
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
