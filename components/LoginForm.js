"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_ADMIN, useAuth } from "@/components/AuthContext";

export default function LoginForm() {
  const { user, loaded, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!loaded) {
    return (
      <div className="empty">
        <p>Loading…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="empty">
        <p className="empty-title">You&apos;re already logged in</p>
        <p className="muted">Signed in as {user.email}</p>
        <Link href="/admin" className="btn btn-primary">
          Go to manage store
        </Link>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) {
      router.push("/admin");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="checkout-form auth-card" onSubmit={submit}>
        <h3>Manager login</h3>
        <p className="muted">Restricted area. Store managers only.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@kamgeorge.com"
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>
        <p className="muted demo-hint">
          Demo credentials — email: <code>{DEMO_ADMIN.email}</code> · password:{" "}
          <code>{DEMO_ADMIN.password}</code>
        </p>
      </form>
    </div>
  );
}
