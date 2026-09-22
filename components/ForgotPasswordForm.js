"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import OtpVerify from "@/components/OtpVerify";

export default function ForgotPasswordForm() {
  const { accountExists, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const stepsBar = (
    <div className="steps">
      <div className={step === 1 ? "step step-active" : "step step-done"}>
        1 · Email
      </div>
      <div
        className={
          step === 2 ? "step step-active" : step > 2 ? "step step-done" : "step"
        }
      >
        2 · Verify email
      </div>
      <div className={step === 3 ? "step step-active" : "step"}>
        3 · New password
      </div>
    </div>
  );

  const submitEmail = (e) => {
    e.preventDefault();
    if (!accountExists(email)) {
      setError("No account found with that email. Check it or create one.");
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
    const res = resetPassword(email, password);
    if (res.ok) {
      setError("");
      setStep(4);
    } else {
      setError(res.error);
    }
  };

  if (step === 2) {
    return (
      <>
        {stepsBar}
        <OtpVerify
          identifier={email.trim()}
          purpose="reset"
          onVerified={() => setStep(3)}
          onBack={() => setStep(1)}
          backLabel="Edit email"
        />
      </>
    );
  }

  if (step === 4) {
    return (
      <div className="auth-wrap">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p className="success-check">✓</p>
          <h2>Password updated!</h2>
          <p className="muted">
            You can now log in with your new password.
          </p>
          <Link href="/login" className="btn btn-primary">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <>
        {stepsBar}
        <div className="auth-wrap">
          <form className="auth-card" onSubmit={submitPassword}>
            <h3>Choose a new password</h3>
            <p className="muted">Minimum 6 characters.</p>
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
              Save new password
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
        <form className="auth-card" onSubmit={submitEmail}>
          <h3>Reset your password</h3>
          <p className="muted">
            Enter your account email — we&apos;ll send you a verification code.
          </p>
          {error && <p className="form-error">{error}</p>}
          <label>
            Email address
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            Send verification code
          </button>
          <p className="auth-switch muted">
            Remembered it? <Link href="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </>
  );
}
