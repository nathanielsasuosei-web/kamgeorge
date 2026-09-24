"use client";

import Link from "next/link";
import { LockIcon } from "@/components/icons";
import { useSettings } from "@/components/SettingsContext";

// Make bare email addresses clickable (e.g. hello@kamgeorge.com).
function SupportLine({ text }) {
  const emailMatch = text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (emailMatch) {
    return (
      <li>
        <a href={`mailto:${text}`}>{text}</a>
      </li>
    );
  }
  return <li>{text}</li>;
}

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="https://i.imgur.com/RsY4DbC_d.webp" alt="KamGeorge logo" />
            <span className="brand-name">KamGeorge</span>
          </div>
          <p className="footer-tag">
            Quality essentials delivered across Ghana. Shop electronics,
            fashion, home and beauty.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li>
              <Link href="/">All products</Link>
            </li>
            <li>
              <Link href="/cart">Your cart</Link>
            </li>
            <li>
              <Link href="/checkout">Checkout</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            {settings.support.map((line) => (
              <SupportLine key={line} text={line} />
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} KamGeorge. All rights reserved.</span>
        <Link href="/admin/login" className="footer-admin">
          <LockIcon size={13} /> Store manager
        </Link>
      </div>
    </footer>
  );
}
