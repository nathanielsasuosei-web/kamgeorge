"use client";

import Link from "next/link";
import { useSettings } from "@/components/SettingsContext";
import { StarIcon } from "@/components/icons";

export default function SubHeader() {
  const { settings } = useSettings();
  const sub = settings.subHeader;

  if (!sub || !sub.enabled) return null;

  return (
    <div className="sub-header-strip">
      <div className="container sub-header-inner">
        <div className="sub-header-left">
          <Link href={sub.sellLink || "/register"} className="sub-header-sell">
            <span className="sub-header-star">★</span>
            <span>{sub.sellText || "Sell on KamGeorge"}</span>
          </Link>
        </div>

        <div className="sub-header-right">
          <span className="sub-brand-badge">{sub.brandBadge || "KAMGEORGE★"}</span>
          {sub.features &&
            sub.features.map((item, i) => (
              <span key={i} className="sub-feature-tag">
                <span className="sub-feature-dot">✪</span>
                {item}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
