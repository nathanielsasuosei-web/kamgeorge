"use client";

import { useTheme } from "@/components/ThemeContext";

export default function ThemeSwatches() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="theme-swatches" role="radiogroup" aria-label="Background colour">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={theme === t.id}
          title={t.label}
          aria-label={`${t.label} background`}
          className={
            theme === t.id ? "theme-swatch theme-swatch-active" : "theme-swatch"
          }
          style={{ background: t.swatch }}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  );
}
