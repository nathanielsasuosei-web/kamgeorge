"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function LoginForm() {
  const { user, loaded, loginCustomer } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!loaded) {
    return (
      <div className="empty">
        <p>Loading…</p>
      </div>
    );
  }

  if (user) {
    const isManager = user.role === "manager";
    return (
      <div className="empty">
        <p className="empty-title">You&apos;re already logged in</p>
        <p className="muted">Signed in as {user.email}</p>
        <Link
          href={isManager ? "/admin" : "/account"}
          className="btn btn-primary"
        >
          {isManager ? "Go to manage store" : "Go to my account"}
        </Link>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const res = loginCustomer(email, password);
    if (res.ok) {
      router.push("/account");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-panel">
        <div className="brand brand-light">
          <span className="brand-mark">K</span>
          <span className="brand-name">KamGeorge</span>
        </div>
        <h2>Welcome back 👋</h2>
        <p>Log in for faster checkout and full order tracking.</p>
        <ul className="auth-points">
          <li>
            <span>⚡</span> Express checkout with saved details
          </li>
          <li>
            <span>📦</span> Track every purchase in one place
          </li>
          <li>
            <span>💳</span> Mobile Money &amp; card ready
          </li>
        </ul>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h3>Log in</h3>
        <p className="muted">Access your customer account.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <div className="password-wrap">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Log in
        </button>
        <p className="auth-switch muted">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
