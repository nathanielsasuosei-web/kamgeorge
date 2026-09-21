"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { user, loaded, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (href) =>
    pathname === href ? "nav-link nav-link-active" : "nav-link";

  const handleLogout = () => {
    logout();
    if (pathname === "/admin") router.push("/");
  };

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
          {/* "Manage store" is only ever rendered for logged-in managers */}
          {loaded && user ? (
            <>
              <Link href="/admin" className={linkClass("/admin")}>
                Manage store
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              Login
            </Link>
          )}
          <Link href="/checkout" className="btn btn-primary btn-sm">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
