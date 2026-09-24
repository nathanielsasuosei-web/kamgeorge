"use client";

import Link from "next/link";
import { useSettings } from "@/components/SettingsContext";
import { PhoneIcon } from "@/components/icons";

export default function TopPromoBanner() {
  const { settings } = useSettings();
  const banner = settings.topBanner;

  if (!banner || !banner.enabled) return null;

  return (
    <div
      className="top-promo-banner"
      style={{
        backgroundColor: banner.bgColor || "#0062ff",
        color: banner.textColor || "#ffffff",
      }}
    >
      <div className="container top-promo-banner-inner">
        <div className="top-promo-left">
          <span className="top-promo-title">{banner.tagline || "BACK TO SCHOOL"}</span>
          {banner.badge && (
            <span className="top-promo-badge">{banner.badge}</span>
          )}
        </div>

        <div className="top-promo-right">
          {banner.phone && (
            <a
              href={`tel:${banner.phone.replace(/\s+/g, "")}`}
              className="top-promo-call"
            >
              <PhoneIcon size={14} />
              <span className="top-promo-call-label">
                {banner.phoneLabel || "CALL TO ORDER"}
              </span>
              <strong className="top-promo-call-number">{banner.phone}</strong>
            </a>
          )}

          {banner.buttonText && (
            <Link
              href={banner.buttonLink || "/#products"}
              className="top-promo-btn"
            >
              {banner.buttonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
