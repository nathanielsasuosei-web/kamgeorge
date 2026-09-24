"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SUPPORT_STORAGE_KEY,
  sanitizeSupportList,
} from "@/lib/settings";

const SettingsContext = createContext(null);

const REMOVED_CATEGORY_NAMES = new Set([
  "phones & tablets",
  "phones",
  "beauty",
  "health & beauty",
  "fashion",
  "fashion & clothes",
]);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // Filter out explicitly removed categories if cached from previous visits
        let loadedCats = DEFAULT_SETTINGS.categories;
        if (Array.isArray(parsed?.categories) && parsed.categories.length > 0) {
          const filtered = parsed.categories.filter((c) => {
            const nameLower = (c.name || c.label || "").toLowerCase().trim();
            return !REMOVED_CATEGORY_NAMES.has(nameLower);
          });
          if (filtered.length > 0) {
            loadedCats = filtered;
          }
        }

        setSettings((prev) => ({
          ...DEFAULT_SETTINGS,
          ...parsed,
          topBanner: {
            ...DEFAULT_SETTINGS.topBanner,
            ...(parsed && parsed.topBanner),
          },
          subHeader: {
            ...DEFAULT_SETTINGS.subHeader,
            ...(parsed && parsed.subHeader),
          },
          heroSlides:
            Array.isArray(parsed?.heroSlides) && parsed.heroSlides.length > 0
              ? parsed.heroSlides
              : DEFAULT_SETTINGS.heroSlides,
          categories: loadedCats,
          helpInfo: {
            ...DEFAULT_SETTINGS.helpInfo,
            ...(parsed && parsed.helpInfo),
          },
          support:
            sanitizeSupportList(parsed && parsed.support) ||
            DEFAULT_SETTINGS.support,
        }));
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings, loaded]);

  const value = useMemo(
    () => ({
      settings,
      loaded,
      updateSettings: (partial) =>
        setSettings((prev) => ({ ...prev, ...partial })),
      updateTopBanner: (bannerData) =>
        setSettings((prev) => ({
          ...prev,
          topBanner: { ...prev.topBanner, ...bannerData },
        })),
      updateSubHeader: (subData) =>
        setSettings((prev) => ({
          ...prev,
          subHeader: { ...prev.subHeader, ...subData },
        })),
      updateHeroSlides: (slides) =>
        setSettings((prev) => ({
          ...prev,
          heroSlides: slides,
        })),
      updateCategories: (cats) =>
        setSettings((prev) => ({
          ...prev,
          categories: cats,
        })),
      updateHelpInfo: (help) =>
        setSettings((prev) => ({
          ...prev,
          helpInfo: { ...prev.helpInfo, ...help },
        })),
      resetSettings: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings, loaded]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
