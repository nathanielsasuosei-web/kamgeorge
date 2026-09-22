// Site-wide editable settings (footer Support lines, etc.).
// Defaults live here; overrides are stored in localStorage via SettingsContext.
export const DEFAULT_SETTINGS = {
  support: [
    "Delivery in 1–3 days",
    "Mobile Money payments",
    "7-day easy returns",
    "hello@kamgeorge.com",
  ],
};

export const SUPPORT_STORAGE_KEY = "kamgeorge-site-settings";

// Keep only non-empty text lines, so a stray edit can't break the footer.
export function sanitizeSupportList(value) {
  if (!Array.isArray(value)) return null;
  const lines = value
    .filter((line) => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);
  return lines.length ? lines : null;
}
