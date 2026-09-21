"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { requestOtp, verifyOtp } from "@/lib/otp";
import OtpInput from "@/components/OtpInput";

function maskIdentifier(id) {
  const s = (id || "").trim();
  if (s.includes("@")) {
    const [local, domain] = s.split("@");
    return `${(local || "").slice(0, 1)}***@${domain || ""}`;
  }
  const d = s.replace(/[\s\-.()]/g, "");
  if (d.length <= 5) return "***";
  return `${d.slice(0, 3)} ••• ${d.slice(-3)}`;
}

export default function OtpVerify({
  identifier,
  purpose,
  onVerified,
  onBack,
  backLabel = "Back",
}) {
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState(null);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const sentRef = useRef(false);

  const send = useCallback(async () => {
    setSending(true);
    const res = requestOtp(identifier, purpose);
    setSending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDemoCode(res.code);
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
    const res = verifyOtp(identifier, code, purpose);
    if (res.ok) {
      onVerified();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="checkout-form auth-card" onSubmit={submit}>
        <h3>Enter verification code</h3>
        <p className="muted">
          We sent a 6-digit code to {maskIdentifier(identifier)}. It expires in
          5 minutes.
        </p>
        {demoCode && (
          <p className="demo-otp">
            Demo mode — no real SMS is sent. Your code is{" "}
            <strong>
              {demoCode.slice(0, 3)} {demoCode.slice(3)}
            </strong>
          </p>
        )}
        {error && <p className="form-error">{error}</p>}
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError("");
          }}
        />
        <button type="submit" className="btn btn-primary btn-block">
          Verify code
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
                ? `Resend in ${cooldown}s`
                : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
