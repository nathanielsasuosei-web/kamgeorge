"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "kamgeorge-auth";

// Demo manager credentials (no backend in this demo — see README).
export const DEMO_ADMIN = {
  email: "admin@kamgeorge.com",
  password: "admin123",
  name: "Store Manager",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email === DEMO_ADMIN.email) {
          setUser({ email: parsed.email, name: parsed.name || DEMO_ADMIN.name });
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  const value = useMemo(
    () => {
      const login = (email, password) => {
        if (
          email.trim().toLowerCase() === DEMO_ADMIN.email &&
          password === DEMO_ADMIN.password
        ) {
          const u = { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name };
          setUser(u);
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ ...u, loginAt: Date.now() })
            );
          } catch {
            // storage unavailable
          }
          return { ok: true };
        }
        return { ok: false, error: "Invalid email or password." };
      };

      const logout = () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // storage unavailable
        }
      };

      return { user, loaded, login, logout };
    },
    [user, loaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
