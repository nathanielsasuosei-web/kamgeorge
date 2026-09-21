"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, userIdentifier } from "@/components/AuthContext";
import { PackageIcon, ReturnsIcon, ZapIcon } from "@/components/icons";
import OtpVerify from "@/components/OtpVerify";

export default function RegisterForm() {
  const { user, loaded, prepareRegistration, completeRegistration } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(null);
  const [name, setName] = useState("");
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

  const submitDetails = (e) => {
    e.preventDefault();
    const res = prepareRegistration({ name, identifier, password });
    if (res.ok) {
      setPending(res.account);
      setError("");
      setStep(2);
    } else {
      setError(res.error);
    }
  };

  const handleVerified = () => {
    const res = completeRegistration(pending);
    if (res.ok) {
      router.push(getNextPath());
    } else {
      setError(res.error);
      setStep(1);
    }
  };

  // Where to go after signup (e.g. back to /checkout); defaults to /account
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
        1 · Account details
      </div>
      <div className={step === 2 ? "step step-active" : "step"}>
        2 · Verify code
      </div>
    </div>
  );

  if (step === 2 && pending) {
    return (
      <>
        {stepsBar}
        <OtpVerify
          identifier={pending.email || pending.phone}
          purpose="register"
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
          <h2>Join KamGeorge</h2>
          <p>Create a free account in seconds — no fees, ever.</p>
          <ul className="auth-points">
            <li>
              <span>
                <ZapIcon size={20} />
              </span>
              Faster checkout with saved details
            </li>
            <li>
              <span>
                <PackageIcon size={20} />
              </span>
              Full purchase history &amp; tracking
            </li>
            <li>
              <span>
                <ReturnsIcon size={20} />
              </span>
              Smoother returns &amp; support
            </li>
          </ul>
        </div>
        <form className="auth-form" onSubmit={submitDetails}>
          <h3>Create account</h3>
          <p className="muted">Use your email or mobile number.</p>
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
            Continue
          </button>
          <p className="auth-switch muted">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </form>
      </div>
    </>
  );
}
