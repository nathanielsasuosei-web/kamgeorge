"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "kamgeorge-auth";
const CUSTOMERS_KEY = "kamgeorge-customers";
const ADMIN_KEY = "kamgeorge-admin";

// Default manager credentials — used until the manager changes them
// from the dashboard (stored in localStorage, see changeManagerCredentials).
export const DEMO_ADMIN = {
  email: "admin@kamgeorge.com",
  password: "admin123",
  name: "Store Manager",
};

// Read the current manager credentials, falling back to the defaults.
export function readAdminCredentials() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.email === "string" &&
        typeof parsed.password === "string" &&
        parsed.email &&
        parsed.password
      ) {
        return {
          email: parsed.email,
          password: parsed.password,
          name: parsed.name || DEMO_ADMIN.name,
        };
      }
    }
  } catch {
    // ignore corrupted storage
  }
  return DEMO_ADMIN;
}

function writeAdminCredentials(creds) {
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(creds));
  } catch {
    // storage unavailable
  }
}

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

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
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

// Display identifier for a customer (email, falling back to phone)
export function userIdentifier(user) {
  if (!user) return "";
  return user.email || user.phone || "";
}

function findCustomer(customers, { email, phone }) {
  return customers.find(
    (c) => (email && c.email === email) || (phone && c.phone === phone)
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email?, phone?, role }
  const [admin, setAdmin] = useState(DEMO_ADMIN); // current manager credentials
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const creds = readAdminCredentials();
    setAdmin(creds);
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          parsed.role === "manager" &&
          parsed.email === creds.email
        ) {
          setUser({
            name: parsed.name,
            email: parsed.email,
            phone: null,
            role: "manager",
          });
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

      // Step 1 of registration: validate only (email verification comes next)
      const prepareRegistration = ({ name, email, phone, password }) => {
        const cleanName = (name || "").trim();
        const cleanEmail = normalizeEmail(email);
        const cleanPhone = (phone || "").trim();
        if (!cleanName) return { ok: false, error: "Please enter your name." };
        if (!validEmail(cleanEmail))
          return { ok: false, error: "Please enter a valid email address." };
        if (cleanPhone && !validPhone(cleanPhone))
          return {
            ok: false,
            error: "Please enter a valid mobile number (e.g. 024 123 4567).",
          };
        if (!password || password.length < 6)
          return {
            ok: false,
            error: "Password must be at least 6 characters.",
          };
        if (cleanEmail === readAdminCredentials().email)
          return {
            ok: false,
            error: "That email is reserved. Please use a different one.",
          };
        if (findCustomer(readCustomers(), { email: cleanEmail })) {
          return {
            ok: false,
            error:
              "An account with this email already exists. Try logging in.",
          };
        }
        return {
          ok: true,
          account: {
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone ? normalizePhone(cleanPhone) : null,
            password,
          },
        };
      };

      // Step 2 of registration: create the account after the email is verified
      const completeRegistration = (account) => {
        if (!account || !account.name || !account.email)
          return { ok: false, error: "Something went wrong. Please start again." };
        const customers = readCustomers();
        if (findCustomer(customers, { email: account.email })) {
          return {
            ok: false,
            error: "An account with this email already exists. Try logging in.",
          };
        }
        // Demo only: stored in plain text in localStorage — never do this in production.
        customers.push({
          name: account.name,
          email: account.email,
          phone: account.phone,
          password: account.password,
        });
        writeCustomers(customers);
        saveSession({
          name: account.name,
          email: account.email,
          phone: account.phone,
          role: "customer",
        });
        return { ok: true };
      };

      // Step 1 of login: check the password (email verification comes next)
      const verifyCustomerPassword = (email, password) => {
        const found = findCustomer(readCustomers(), {
          email: normalizeEmail(email),
        });
        if (!found)
          return {
            ok: false,
            error: "No account found. Check your email or create one below.",
          };
        if (found.password !== password)
          return { ok: false, error: "Incorrect password." };
        return { ok: true, name: found.name };
      };

      // Step 2 of login: create the session after the email is verified
      const loginCustomerWithCode = (email) => {
        const found = findCustomer(readCustomers(), {
          email: normalizeEmail(email),
        });
        if (!found) return { ok: false, error: "Account no longer exists." };
        saveSession({
          name: found.name,
          email: found.email || null,
          phone: found.phone || null,
          role: "customer",
        });
        return { ok: true };
      };

      const accountExists = (email) => {
        return !!findCustomer(readCustomers(), {
          email: normalizeEmail(email),
        });
      };

      const resetPassword = (email, newPassword) => {
        if (!newPassword || newPassword.length < 6)
          return {
            ok: false,
            error: "Password must be at least 6 characters.",
          };
        const clean = normalizeEmail(email);
        const customers = readCustomers();
        const idx = customers.findIndex((c) => c.email === clean);
        if (idx === -1) return { ok: false, error: "Account not found." };
        customers[idx] = { ...customers[idx], password: newPassword };
        writeCustomers(customers);
        return { ok: true };
      };

      const loginManager = (email, password) => {
        const creds = readAdminCredentials();
        if (normalizeEmail(email) === creds.email && password === creds.password) {
          saveSession({
            name: creds.name,
            email: creds.email,
            phone: null,
            role: "manager",
          });
          return { ok: true };
        }
        return { ok: false, error: "Invalid manager email or password." };
      };

      // Let the manager change their own login email / password.
      // Requires the current password; keeps an active manager session valid.
      const changeManagerCredentials = ({
        currentPassword,
        email,
        newPassword,
      }) => {
        const creds = readAdminCredentials();
        if (currentPassword !== creds.password) {
          return { ok: false, error: "Current password is incorrect." };
        }
        const cleanEmail = normalizeEmail(email);
        if (!validEmail(cleanEmail)) {
          return { ok: false, error: "Please enter a valid email address." };
        }
        if (cleanEmail !== creds.email) {
          // Don't take over an email a customer account already uses.
          if (findCustomer(readCustomers(), { email: cleanEmail })) {
            return {
              ok: false,
              error: "A customer account already uses that email.",
            };
          }
        }
        if (newPassword && newPassword.length < 6) {
          return {
            ok: false,
            error: "New password must be at least 6 characters.",
          };
        }
        const next = {
          email: cleanEmail,
          password: newPassword || creds.password,
          name: creds.name,
        };
        writeAdminCredentials(next);
        setAdmin(next);
        // Keep an active manager session in sync with the new email.
        setUser((u) => {
          if (!u || u.role !== "manager") return u;
          const updated = { ...u, email: next.email };
          try {
            localStorage.setItem(
              SESSION_KEY,
              JSON.stringify({ ...updated, loginAt: Date.now() })
            );
          } catch {
            // storage unavailable
          }
          return updated;
        });
        return { ok: true };
      };

      const logout = () => {
        setUser(null);
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          // storage unavailable
        }
      };

      return {
        user,
        loaded,
        adminEmail: admin.email,
        usingDefaultCredentials:
          admin.email === DEMO_ADMIN.email &&
          admin.password === DEMO_ADMIN.password,
        prepareRegistration,
        completeRegistration,
        verifyCustomerPassword,
        loginCustomerWithCode,
        accountExists,
        resetPassword,
        loginManager,
        changeManagerCredentials,
        logout,
      };
    },
    [user, loaded, admin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
