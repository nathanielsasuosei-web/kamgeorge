"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import OtpVerify from "@/components/OtpVerify";

export default function ForgotPasswordForm() {
  const { loaded, accountExists, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!loaded) {
    return (
      <div className="empty">
        <p>Loading…</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="empty">
        <p className="success-check">✓</p>
        <p className="empty-title">Password updated!</p>
        <p className="muted">Log in with your new password.</p>
        <Link href="/login" className="btn btn-primary">
          Go to login
        </Link>
      </div>
    );
  }

  const submitIdentifier = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your email or mobile number.");
      return;
    }
    if (!accountExists(identifier)) {
      setError("No account found with these details.");
      return;
    }
    setError("");
    setStep(2);
  };

  const submitPassword = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const res = resetPassword(identifier, password);
    if (res.ok) {
      setDone(true);
    } else {
      setError(res.error);
    }
  };

  const stepsBar = (
    <div className="steps">
      <div className={step === 1 ? "step step-active" : "step step-done"}>
        1 · Account
      </div>
      <div
        className={
          step === 2 ? "step step-active" : step > 2 ? "step step-done" : "step"
        }
      >
        2 · Verify
      </div>
      <div className={step === 3 ? "step step-active" : "step"}>
        3 · New password
      </div>
    </div>
  );

  if (step === 2) {
    return (
      <>
        {stepsBar}
        <OtpVerify
          identifier={identifier.trim()}
          purpose="reset"
          onVerified={() => setStep(3)}
          onBack={() => setStep(1)}
          backLabel="Change account"
        />
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        {stepsBar}
        <div className="auth-wrap">
          <form className="checkout-form auth-card" onSubmit={submitPassword}>
            <h3>Choose a new password</h3>
            <p className="muted">Make it at least 6 characters.</p>
            {error && <p className="form-error">{error}</p>}
            <label>
              New password
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
            <label>
              Confirm new password
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
            <button type="submit" className="btn btn-primary btn-block">
              Update password
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      {stepsBar}
      <div className="auth-wrap">
        <form className="checkout-form auth-card" onSubmit={submitIdentifier}>
          <h3>Reset your password</h3>
          <p className="muted">
            Enter the email or number you registered with.
          </p>
          {error && <p className="form-error">{error}</p>}
          <label>
            Email or mobile number
            <input
              className="input"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 024 123 4567"
              autoComplete="username"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            Send code
          </button>
          <p className="auth-switch muted">
            Remembered it? <Link href="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </>
  );
}
