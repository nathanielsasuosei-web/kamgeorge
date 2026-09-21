"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function RegisterForm() {
  const { user, loaded, register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
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
    const res = register({ name, email, password });
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
        <h2>Join KamGeorge 🛍️</h2>
        <p>Create a free account in seconds — no fees, ever.</p>
        <ul className="auth-points">
          <li>
            <span>⚡</span> Faster checkout with saved details
          </li>
          <li>
            <span>📦</span> Full purchase history &amp; tracking
          </li>
          <li>
            <span>↩️</span> Smoother returns &amp; support
          </li>
        </ul>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h3>Create account</h3>
        <p className="muted">Start shopping smarter today.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Full name
          <input
            className="input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ama Serwaa"
            autoComplete="name"
          />
        </label>
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
          Password (min. 6 characters)
          <div className="password-wrap">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
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
          Create account
        </button>
        <p className="auth-switch muted">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
