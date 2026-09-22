"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { maskEmail, requestEmailCode, verifyEmailCode } from "@/lib/otp";
import OtpInput from "@/components/OtpInput";

export default function OtpVerify({
  identifier,
  purpose,
  onVerified,
  onBack,
  backLabel = "Back",
}) {
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState(null);
  const [emailed, setEmailed] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const sentRef = useRef(false);

  const send = useCallback(async () => {
    setSending(true);
    const res = await requestEmailCode(identifier, purpose);
    setSending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDemoCode(res.sent ? null : res.code);
    setEmailed(!!res.sent);
    setNotice(res.notice || "");
    setCooldown(30);
    setError("");
    setCode("");
  }, [identifier, purpose]);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    send();
  }, [send]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    const res = verifyEmailCode(identifier, code, purpose);
    if (res.ok) {
      onVerified();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="checkout-form auth-card" onSubmit={submit}>
        <h3>Check your email</h3>
        <p className="muted">
          We sent a 6-digit verification code to {maskEmail(identifier)}. It
          expires in 5 minutes.
        </p>
        {emailed && (
          <p className="form-success">
            Code sent! Check your inbox (and spam folder).
          </p>
        )}
        {demoCode && (
          <p className="demo-otp">
            ✉️ Demo mode — email preview. Your code is{" "}
            <strong>
              {demoCode.slice(0, 3)} {demoCode.slice(3)}
            </strong>
          </p>
        )}
        {notice && <p className="muted">{notice}</p>}
        {error && <p className="form-error">{error}</p>}
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError("");
          }}
        />
        <button type="submit" className="btn btn-primary btn-block">
          Verify email
        </button>
        <div className="otp-actions">
          <button type="button" className="link-btn" onClick={onBack}>
            ← {backLabel}
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={send}
            disabled={sending || cooldown > 0}
          >
            {sending
              ? "Sending…"
              : cooldown > 0
                ? `Resend email in ${cooldown}s`
                : "Resend email"}
          </button>
        </div>
      </form>
    </div>
  );
}
