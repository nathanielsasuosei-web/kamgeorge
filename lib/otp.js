// Email verification codes (demo).
//
// In this demo there is no email backend, so requestEmailCode() returns the
// code and the UI shows it in a labeled "email preview" box instead of
// really sending an email. Codes expire after 5 minutes, allow 5 attempts
// and enforce a 30-second resend wait.
//
// TO GO LIVE: send the code through an email provider (e.g. Resend,
// SendGrid or Postmark) inside requestEmailCode() via a Next.js server
// route (never expose the provider API key in the browser) and stop
// returning the code to the client. Everything else (OtpVerify UI, expiry,
// attempts) stays the same.

const STORAGE_KEY = "kamgeorge-email-codes";
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_WAIT_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage unavailable
  }
}

export function maskEmail(email) {
  const s = (email || "").trim();
  const [local, domain] = s.split("@");
  if (!domain) return "***";
  return `${(local || "").slice(0, 1)}***@${domain}`;
}

// "Send" a 6-digit verification code to an email address (demo: returned).
export function requestEmailCode(email, purpose) {
  if (typeof window === "undefined")
    return { ok: false, error: "Verification is unavailable." };
  const clean = (email || "").trim().toLowerCase();
  if (!/.+@.+\..+/.test(clean))
    return { ok: false, error: "Please enter a valid email address." };

  const key = `${purpose}:${clean}`;
  const now = Date.now();
  const store = readStore();
  const prev = store[key];
  if (prev && now - prev.sentAt < RESEND_WAIT_MS) {
    const wait = Math.ceil((RESEND_WAIT_MS - (now - prev.sentAt)) / 1000);
    return {
      ok: false,
      error: `Please wait ${wait}s before requesting a new code.`,
    };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  store[key] = { code, expires: now + CODE_TTL_MS, attempts: 0, sentAt: now };
  writeStore(store);
  return { ok: true, code }; // demo only — see header
}

export function verifyEmailCode(email, code, purpose) {
  if (typeof window === "undefined")
    return { ok: false, error: "Verification is unavailable." };
  const clean = (email || "").trim().toLowerCase();
  const key = `${purpose}:${clean}`;
  const store = readStore();
  const entry = store[key];

  if (!entry)
    return {
      ok: false,
      error: "No code was sent. Please request a new one.",
    };
  if (Date.now() > entry.expires) {
    delete store[key];
    writeStore(store);
    return {
      ok: false,
      error: "That code has expired. Please request a new one.",
    };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    delete store[key];
    writeStore(store);
    return {
      ok: false,
      error: "Too many attempts. Please request a new code.",
    };
  }
  if ((code || "").trim() !== entry.code) {
    entry.attempts += 1;
    writeStore(store);
    const left = MAX_ATTEMPTS - entry.attempts;
    return {
      ok: false,
      error:
        left > 0
          ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`
          : "Too many attempts. Please request a new code.",
    };
  }

  delete store[key];
  writeStore(store);
  return { ok: true };
}
