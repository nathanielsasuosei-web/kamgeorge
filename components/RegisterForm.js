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
    <div className="auth-wrap">
      <form className="checkout-form auth-card" onSubmit={submit}>
        <h3>Create your account</h3>
        <p className="muted">Faster checkout and order updates.</p>
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
          <input
            className="input"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block">
          Create account
        </button>
        <p className="auth-switch muted">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
