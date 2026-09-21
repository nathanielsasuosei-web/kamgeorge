"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "kamgeorge-auth";
const CUSTOMERS_KEY = "kamgeorge-customers";

// Demo manager credentials (no backend in this demo — see README).
export const DEMO_ADMIN = {
  email: "admin@kamgeorge.com",
  password: "admin123",
  name: "Store Manager",
};

function readCustomers() {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomers(list) {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable
  }
}

const normalizeEmail = (email) => email.trim().toLowerCase();
const validEmail = (email) => /.+@.+\..+/.test(email);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email, role: "customer" | "manager" }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          parsed.email &&
          (parsed.role === "manager" || parsed.role === "customer")
        ) {
          if (parsed.role === "manager" && parsed.email !== DEMO_ADMIN.email) {
            localStorage.removeItem(SESSION_KEY);
          } else {
            setUser({
              name: parsed.name,
              email: parsed.email,
              role: parsed.role,
            });
          }
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  const value = useMemo(
    () => {
      const saveSession = (u) => {
        setUser(u);
        try {
          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ ...u, loginAt: Date.now() })
          );
        } catch {
          // storage unavailable
        }
      };

      const register = ({ name, email, password }) => {
        const cleanName = name.trim();
        const cleanEmail = normalizeEmail(email);
        if (!cleanName) return { ok: false, error: "Please enter your name." };
        if (!validEmail(cleanEmail))
          return { ok: false, error: "Please enter a valid email address." };
        if (!password || password.length < 6)
          return { ok: false, error: "Password must be at least 6 characters." };
        if (cleanEmail === DEMO_ADMIN.email)
          return {
            ok: false,
            error: "That email is reserved. Please use a different one.",
          };
        const customers = readCustomers();
        if (customers.some((c) => c.email === cleanEmail)) {
          return {
            ok: false,
            error: "An account with this email already exists. Try logging in.",
          };
        }
        // Demo only: stored in plain text in localStorage — never do this in production.
        customers.push({ name: cleanName, email: cleanEmail, password });
        writeCustomers(customers);
        saveSession({ name: cleanName, email: cleanEmail, role: "customer" });
        return { ok: true };
      };

      const loginCustomer = (email, password) => {
        const cleanEmail = normalizeEmail(email);
        const found = readCustomers().find((c) => c.email === cleanEmail);
        if (!found)
          return {
            ok: false,
            error: "No account found with this email. Create one below.",
          };
        if (found.password !== password)
          return { ok: false, error: "Incorrect password." };
        saveSession({ name: found.name, email: found.email, role: "customer" });
        return { ok: true };
      };

      const loginManager = (email, password) => {
        if (
          normalizeEmail(email) === DEMO_ADMIN.email &&
          password === DEMO_ADMIN.password
        ) {
          saveSession({
            name: DEMO_ADMIN.name,
            email: DEMO_ADMIN.email,
            role: "manager",
          });
          return { ok: true };
        }
        return { ok: false, error: "Invalid manager email or password." };
      };

      const logout = () => {
        setUser(null);
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          // storage unavailable
        }
      };

      return { user, loaded, register, loginCustomer, loginManager, logout };
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
