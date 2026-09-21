"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, userIdentifier } from "@/components/AuthContext";
import { CardIcon, PackageIcon, ZapIcon } from "@/components/icons";
import OtpVerify from "@/components/OtpVerify";

export default function LoginForm() {
  const { user, loaded, verifyCustomerPassword, loginCustomerWithOtp } =
    useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
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
        <p className="muted">Signed in as {userIdentifier(user)}</p>
        <Link
          href={isManager ? "/admin" : "/account"}
          className="btn btn-primary"
        >
          {isManager ? "Go to manage store" : "Go to my account"}
        </Link>
      </div>
    );
  }

  const submitPassword = (e) => {
    e.preventDefault();
    const res = verifyCustomerPassword(identifier, password);
    if (res.ok) {
      setError("");
      setStep(2);
    } else {
      setError(res.error);
    }
  };

  const handleVerified = () => {
    const res = loginCustomerWithOtp(identifier);
    if (res.ok) {
      router.push(getNextPath());
    } else {
      setError(res.error);
      setStep(1);
    }
  };

  // Where to go after login (e.g. back to /checkout); defaults to /account
  function getNextPath() {
    try {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    } catch {
      // ignore
    }
    return "/account";
  }

  const stepsBar = (
    <div className="steps">
      <div className={step === 1 ? "step step-active" : "step step-done"}>
        1 · Password
      </div>
      <div className={step === 2 ? "step step-active" : "step"}>
        2 · Verify code
      </div>
    </div>
  );

  if (step === 2) {
    return (
      <>
        {stepsBar}
        <OtpVerify
          identifier={identifier.trim()}
          purpose="login"
          onVerified={handleVerified}
          onBack={() => setStep(1)}
          backLabel="Edit details"
        />
      </>
    );
  }

  return (
    <>
      {stepsBar}
      <div className="auth-split">
        <div className="auth-panel">
          <div className="brand brand-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="https://i.imgur.com/RsY4DbC_d.webp" alt="KamGeorge logo" />
            <span className="brand-name">KamGeorge</span>
          </div>
          <h2>Welcome back</h2>
          <p>Log in for faster checkout and full order tracking.</p>
          <ul className="auth-points">
            <li>
              <span>
                <ZapIcon size={20} />
              </span>
              Express checkout with saved details
            </li>
            <li>
              <span>
                <PackageIcon size={20} />
              </span>
              Track every purchase in one place
            </li>
            <li>
              <span>
                <CardIcon size={20} />
              </span>
              Mobile Money ready
            </li>
          </ul>
        </div>
        <form className="auth-form" onSubmit={submitPassword}>
          <h3>Log in</h3>
          <p className="muted">Use your email or mobile number.</p>
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
            Continue
          </button>
          <p className="auth-switch muted">
            <Link href="/forgot-password">Forgot password?</Link>
            {" · "}
            New here? <Link href="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </>
  );
}
