"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { categories } from "@/lib/products";
import { SHOP_SEARCH_EVENT } from "@/lib/shopSearch";
import {
  CartIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  TruckIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";

// Anchor into the product grid on the home page
const categoryHref = (category) =>
  category === "All"
    ? "/#products"
    : `/?c=${encodeURIComponent(category)}#products`;

export default function Navbar() {
  const { count } = useCart();
  const { user, loaded, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [term, setTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer on navigation and keep the search box in sync
  // with the grid's filters (which live in the URL).
  useEffect(() => {
    setMenuOpen(false);
    const params = new URLSearchParams(window.location.search);
    setTerm(params.get("q") || "");
  }, [pathname]);

  const linkClass = (href) =>
    pathname === href ? "nav-link nav-link-active" : "nav-link";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    if (pathname === "/account" || pathname.startsWith("/admin"))
      router.push("/");
  };

  // Deep-link the grid (?q= / ?c=) and, when we are already on the home
  // page, tell the grid directly so it filters without a reload.
  const goToProducts = (params = {}) => {
    const search = new URLSearchParams(params).toString();
    router.push(search ? `/?${search}#products` : "/#products");
    if (pathname === "/") {
      window.dispatchEvent(
        new CustomEvent(SHOP_SEARCH_EVENT, { detail: params })
      );
      setTerm(params.q || "");
      requestAnimationFrame(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    setMenuOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const q = term.trim();
    goToProducts(q ? { q } : {});
  };

  // Category links keep their href so they stay shareable — on the home page
  // we intercept the click and filter the grid in place.
  const onCategoryClick = (category) => (event) => {
    if (pathname !== "/") return;
    event.preventDefault();
    goToProducts(category === "All" ? {} : { c: category });
  };

  const firstName = user ? user.name.split(" ")[0] : "";
  const accountHref = user
    ? user.role === "customer"
      ? "/account"
      : "/admin"
    : "/login";

  const searchForm = (extraClass) => (
    <form
      className={`header-search ${extraClass || ""}`}
      role="search"
      onSubmit={submitSearch}
    >
      <SearchIcon size={18} className="header-search-icon" />
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search headphones, sneakers, perfume…"
        aria-label="Search products"
      />
      <button type="submit" className="header-search-btn">
        Search
      </button>
    </form>
  );

  return (
    <>
      {/* ---------- Announcement strip (scrolls away with the page) ---------- */}
      <div className="header-top">
        <div className="container header-top-inner">
          <span className="header-top-msg">
            <TruckIcon size={15} />
            Free delivery in Accra on orders over GH₵500 · Pay with Mobile Money
          </span>
          <div className="header-top-links">
            <span className="header-top-item">
              <PhoneIcon size={14} />
              030 000 0000
            </span>
            {loaded && user ? (
              <>
                <Link href={accountHref} className="header-top-item">
                  <UserIcon size={14} />
                  Hi, {firstName}
                </Link>
                <button className="header-top-btn" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="header-top-item">
                  Sign in
                </Link>
                <Link href="/register" className="header-top-item">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Sticky header: main bar + category nav ---------- */}
      <header className="site-header">
        <div className="header-main">
          <div className="container header-main-inner">
            <Link href="/" className="header-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="header-logo"
                src="https://i.imgur.com/RsY4DbC_d.webp"
                alt="KamGeorge logo"
              />
              <span className="header-brand-text">
                <span className="header-brand-name">KamGeorge</span>
                <span className="header-brand-tag">
                  Quality essentials · Ghana
                </span>
              </span>
            </Link>

            {searchForm("header-search-desktop")}

            <div className="header-actions">
              <Link href={accountHref} className="header-action">
                <UserIcon size={20} />
                <span className="header-action-label">
                  {loaded && user ? `Hi, ${firstName}` : "Account"}
                  <small>
                    {loaded && user ? "My purchases" : "Sign in / Register"}
                  </small>
                </span>
              </Link>

              <Link href="/cart" className="header-action">
                <span className="header-cart-icon">
                  <CartIcon size={20} />
                  {count > 0 && (
                    <span className="header-cart-badge">{count}</span>
                  )}
                </span>
                <span className="header-action-label">
                  Cart
                  <small>
                    {count > 0 ? `${count} item${count === 1 ? "" : "s"}` : "Empty"}
                  </small>
                </span>
              </Link>

              <Link href="/checkout" className="header-cta">
                Checkout
              </Link>

              <button
                className="header-burger"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>
          </div>
        </div>

        <nav className="header-nav" aria-label="Product categories">
          <div className="container header-nav-inner">
            <ul className="header-nav-list">
              <li>
                <Link
                  href="/#products"
                  className="header-nav-link header-nav-link-strong"
                  onClick={onCategoryClick("All")}
                >
                  Shop all
                </Link>
              </li>
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <li key={c}>
                    <Link
                      href={categoryHref(c)}
                      className="header-nav-link"
                      onClick={onCategoryClick(c)}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/cart" className={linkClass("/cart")}>
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className={linkClass("/account")}>
                  My purchases
                </Link>
              </li>
            </ul>
            <span className="header-nav-note">
              MoMo · Card · Fast nationwide delivery
            </span>
          </div>
        </nav>

        {/* ---------- Mobile drawer ---------- */}
        {menuOpen && (
          <div className="header-drawer">
            <div className="container">
              {searchForm("header-search-mobile")}
              <ul className="header-drawer-list">
                <li>
                  <Link href="/" onClick={onCategoryClick("All")}>
                    Shop all
                  </Link>
                </li>
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <li key={c}>
                      <Link href={categoryHref(c)} onClick={onCategoryClick(c)}>
                        {c}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link href="/cart">Cart {count > 0 ? `(${count})` : ""}</Link>
                </li>
                <li>
                  <Link href={accountHref}>
                    {loaded && user ? `Hi, ${firstName}` : "Login"}
                  </Link>
                </li>
                {!(loaded && user) && (
                  <li>
                    <Link href="/register">Create account</Link>
                  </li>
                )}
                <li>
                  <Link href="/checkout">Checkout</Link>
                </li>
              </ul>
              {loaded && user && (
                <button
                  className="btn btn-secondary btn-block"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
