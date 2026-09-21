// OTP (one-time passcode) manager — demo version.
//
// Demo limitation: without an SMS/email provider account there is no way to
// deliver real codes, so requestOtp() returns the code and the UI displays it
// in a clearly-labeled demo box. To go live, send the code via a provider
// (e.g. Arkesel, Hubtel, Africa's Talking) inside requestOtp() — ideally from
// a server route so codes never touch the client — and stop returning it.

const STORAGE_KEY = "kamgeorge-otp";
const CODE_TTL_MS = 5 * 60 * 1000; // codes expire after 5 minutes
const RESEND_WAIT_MS = 30 * 1000; // 30s between sends
const MAX_ATTEMPTS = 5;

function readStore() {
  if (typeof window === "undefined") return {};
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

const storeKey = (purpose, identifier) =>
  `${purpose}:${(identifier || "").trim().toLowerCase()}`;

export function requestOtp(identifier, purpose) {
  if (typeof window === "undefined")
    return { ok: false, error: "OTP is unavailable right now." };
  const id = (identifier || "").trim();
  if (!id) return { ok: false, error: "Missing contact details." };

  const store = readStore();
  const k = storeKey(purpose, id);
  const prev = store[k];
  const now = Date.now();
  if (prev && prev.lastSentAt && now - prev.lastSentAt < RESEND_WAIT_MS) {
    const wait = Math.ceil((RESEND_WAIT_MS - (now - prev.lastSentAt)) / 1000);
    return {
      ok: false,
      error: `Please wait ${wait}s before requesting a new code.`,
    };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  store[k] = {
    code,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  };
  writeStore(store);

  // TODO(live): send `code` to `id` via SMS/email provider here.
  return { ok: true, code };
}

export function verifyOtp(identifier, code, purpose) {
  const id = (identifier || "").trim();
  const clean = (code || "").replace(/\D/g, "");
  const store = readStore();
  const k = storeKey(purpose, id);
  const rec = store[k];

  if (!rec)
    return { ok: false, error: "No code was sent. Please request a new one." };
  if (Date.now() > rec.expiresAt) {
    delete store[k];
    writeStore(store);
    return { ok: false, error: "Code expired. Please request a new one." };
  }
  if (rec.attempts >= MAX_ATTEMPTS) {
    delete store[k];
    writeStore(store);
    return {
      ok: false,
      error: "Too many attempts. Please request a new code.",
    };
  }
  if (clean !== rec.code) {
    rec.attempts += 1;
    writeStore(store);
    const left = MAX_ATTEMPTS - rec.attempts;
    return {
      ok: false,
      error: `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`,
    };
  }

  delete store[k];
  writeStore(store);
  return { ok: true };
}
