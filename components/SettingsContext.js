"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SUPPORT_STORAGE_KEY,
  sanitizeSupportList,
} from "@/lib/settings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const support = sanitizeSupportList(parsed && parsed.support);
        if (support) setSettings({ ...DEFAULT_SETTINGS, support });
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
