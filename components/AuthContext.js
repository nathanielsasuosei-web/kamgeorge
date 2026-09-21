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

// Ghana mobile numbers: 0241234567, +233241234567, 233241234567 (spaces/dashes ignored)
export function normalizePhone(raw) {
  let d = (raw || "").replace(/[\s\-.()]/g, "");
  if (d.startsWith("+233")) d = "0" + d.slice(4);
  else if (/^233\d{9}$/.test(d)) d = "0" + d.slice(3);
  return d;
}

export function validPhone(raw) {
  return /^0\d{9}$/.test(normalizePhone(raw));
}

// Display identifier for a customer (email or mobile number, whichever exists)
export function userIdentifier(user) {
  if (!user) return "";
  return user.email || user.phone || "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email?, phone?, role }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role === "manager" && parsed.email === DEMO_ADMIN.email) {
          setUser({ name: parsed.name, email: parsed.email, phone: null, role: "manager" });
        } else if (
          parsed &&
          parsed.role === "customer" &&
          (parsed.email || parsed.phone)
        ) {
          setUser({
            name: parsed.name,
            email: parsed.email || null,
            phone: parsed.phone || null,
            role: "customer",
          });
        } else {
          localStorage.removeItem(SESSION_KEY);
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

      const register = ({ name, identifier, password }) => {
        const cleanName = (name || "").trim();
        const rawId = (identifier || "").trim();
        if (!cleanName) return { ok: false, error: "Please enter your name." };
        if (!rawId)
          return { ok: false, error: "Please enter your email or mobile number." };
        const isEmail = rawId.includes("@");
        const email = isEmail ? normalizeEmail(rawId) : null;
        const phone = isEmail ? null : normalizePhone(rawId);
        if (isEmail && !validEmail(email))
          return { ok: false, error: "Please enter a valid email address." };
        if (!isEmail && !validPhone(rawId))
          return {
            ok: false,
            error: "Please enter a valid mobile number (e.g. 024 123 4567).",
          };
        if (!password || password.length < 6)
          return { ok: false, error: "Password must be at least 6 characters." };
        if (email === DEMO_ADMIN.email)
          return {
            ok: false,
            error: "That email is reserved. Please use a different one.",
          };
        const customers = readCustomers();
        const taken = customers.some(
          (c) => (email && c.email === email) || (phone && c.phone === phone)
        );
        if (taken) {
          return {
            ok: false,
            error: `An account with this ${
              isEmail ? "email" : "number"
            } already exists. Try logging in.`,
          };
        }
        // Demo only: stored in plain text in localStorage — never do this in production.
        customers.push({ name: cleanName, email, phone, password });
        writeCustomers(customers);
        saveSession({ name: cleanName, email, phone, role: "customer" });
        return { ok: true };
      };

      const loginCustomer = (identifier, password) => {
        const rawId = (identifier || "").trim();
        const isEmail = rawId.includes("@");
        const email = isEmail ? normalizeEmail(rawId) : null;
        const phone = isEmail ? null : normalizePhone(rawId);
        const found = readCustomers().find(
          (c) => (email && c.email === email) || (phone && c.phone === phone)
        );
        if (!found)
          return {
            ok: false,
            error: "No account found. Check your details or create one below.",
          };
        if (found.password !== password)
          return { ok: false, error: "Incorrect password." };
        saveSession({
          name: found.name,
          email: found.email || null,
          phone: found.phone || null,
          role: "customer",
        });
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
            phone: null,
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
