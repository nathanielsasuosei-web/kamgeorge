"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();

  const linkClass = (href) =>
    pathname === href ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">K</span>
          <span className="brand-name">KamGeorge</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className={linkClass("/")}>
            Shop
          </Link>
          <Link href="/cart" className={linkClass("/cart")}>
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <Link href="/checkout" className="btn btn-primary btn-sm">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
