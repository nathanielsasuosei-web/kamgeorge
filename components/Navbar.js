"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { useSettings } from "@/components/SettingsContext";
import { SHOP_SEARCH_EVENT } from "@/lib/shopSearch";
import TopPromoBanner from "@/components/TopPromoBanner";
import SubHeader from "@/components/SubHeader";
import {
  CartIcon,
  ChevronDownIcon,
  HelpIcon,
  LockIcon,
  MenuIcon,
  PhoneIcon,
  RenderCategoryIcon,
  SearchIcon,
  StarBadgeIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";

export default function Navbar() {
  const { count } = useCart();
  const { user, loaded, logout } = useAuth();
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();

  const [term, setTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const accountRef = useRef(null);
  const helpRef = useRef(null);

  const categories = settings.categories || [];
  const helpInfo = settings.helpInfo || {};

  // Close menus on outside click or navigation
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setHelpOpen(false);
    const params = new URLSearchParams(window.location.search);
    setTerm(params.get("q") || "");
    setActiveCategory(params.get("c") || "All");
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setAccountOpen(false);
    if (pathname === "/account" || pathname.startsWith("/admin")) {
      router.push("/");
    }
  };

  const goToProducts = (params = {}) => {
    const search = new URLSearchParams(params).toString();
    router.push(search ? `/?${search}#products` : "/#products");
    if (pathname === "/") {
      window.dispatchEvent(
        new CustomEvent(SHOP_SEARCH_EVENT, { detail: params })
      );
      setTerm(params.q || "");
      if (params.c) setActiveCategory(params.c);
      else if (!params.q && !params.c) setActiveCategory("All");

      requestAnimationFrame(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    setMenuOpen(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    goToProducts(q ? { q } : {});
  };

  const onCategoryClick = (catName) => (e) => {
    e.preventDefault();
    setActiveCategory(catName);
    if (catName === "All" || catName === "Official Stores") {
      goToProducts({});
    } else {
      goToProducts({ c: catName });
    }
  };

  const firstName = user ? user.name.split(" ")[0] : "";
  const accountHref = user
    ? user.role === "manager"
      ? "/admin"
      : "/account"
    : "/login";

  return (
    <>
      {/* 1. Top Announcement / Promotional Banner */}
      <TopPromoBanner />

      {/* 2. Sub-top Utility bar (Sell on store + brand ecosystems) */}
      <SubHeader />

      {/* 3. Main Header & Category Navigation */}
      <header className="site-header-jumia">
        <div className="jumia-header-main">
          <div className="container jumia-header-main-inner">
            {/* Logo */}
            <Link href="/" className="jumia-logo-wrap">
              <span className="jumia-logo-text">KAMGEORGE</span>
              <StarBadgeIcon size={18} className="jumia-logo-star" />
            </Link>

            {/* Central Search Bar */}
            <form
              className="jumia-search-bar"
              role="search"
              onSubmit={submitSearch}
            >
              <div className="jumia-search-input-wrap">
                <SearchIcon size={19} className="jumia-search-icon" />
                <input
                  type="search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search products, brands and categories"
                  aria-label="Search products, brands and categories"
                  className="jumia-search-input"
                />
              </div>
              <button type="submit" className="jumia-search-btn">
                Search
              </button>
            </form>

            {/* Right Action Icons */}
            <div className="jumia-header-actions">
              {/* Account Dropdown */}
              <div
                className="jumia-action-dropdown-wrap"
                ref={accountRef}
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className="jumia-header-action-btn"
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-expanded={accountOpen}
                >
                  <UserIcon size={21} />
                  <span className="jumia-action-title">
                    {loaded && user ? `Hi, ${firstName}` : "Account"}
                  </span>
                  <ChevronDownIcon size={14} className="jumia-chevron" />
                </button>

                {accountOpen && (
                  <div className="jumia-dropdown-menu jumia-account-menu">
                    {loaded && user ? (
                      <div className="jumia-menu-user-info">
                        <p className="jumia-user-name">{user.name}</p>
                        <p className="jumia-user-email muted">
                          {user.email || user.phone}
                        </p>
                      </div>
                    ) : (
                      <div className="jumia-menu-auth-btns">
                        <Link
                          href="/login"
                          className="btn btn-primary btn-block"
                          onClick={() => setAccountOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="btn btn-secondary btn-block"
                          onClick={() => setAccountOpen(false)}
                        >
                          Create Account
                        </Link>
                      </div>
                    )}

                    <div className="jumia-menu-divider" />

                    <ul className="jumia-menu-list">
                      {loaded && user && (
                        <li>
                          <Link
                            href={accountHref}
                            onClick={() => setAccountOpen(false)}
                          >
                            <UserIcon size={16} />
                            {user.role === "manager"
                              ? "Store Manager Dashboard"
                              : "My Account"}
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href={loaded && user ? "/account" : "/login"}
                          onClick={() => setAccountOpen(false)}
                        >
                          <CartIcon size={16} />
                          Orders &amp; Purchases
                        </Link>
                      </li>
                      <li>
                        <Link href="/cart" onClick={() => setAccountOpen(false)}>
                          <CartIcon size={16} />
                          Your Cart ({count})
                        </Link>
                      </li>
                      {(!user || user.role !== "manager") && (
                        <li>
                          <Link
                            href="/admin/login"
                            onClick={() => setAccountOpen(false)}
                          >
                            <LockIcon size={16} />
                            Store Manager
                          </Link>
                        </li>
                      )}
                    </ul>

                    {loaded && user && (
                      <>
                        <div className="jumia-menu-divider" />
                        <button
                          type="button"
                          className="jumia-menu-logout-btn"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Help Dropdown */}
              <div
                className="jumia-action-dropdown-wrap"
                ref={helpRef}
                onMouseEnter={() => setHelpOpen(true)}
                onMouseLeave={() => setHelpOpen(false)}
              >
                <button
                  type="button"
                  className="jumia-header-action-btn"
                  onClick={() => setHelpOpen((o) => !o)}
                  aria-expanded={helpOpen}
                >
                  <HelpIcon size={21} />
                  <span className="jumia-action-title">Help</span>
                  <ChevronDownIcon size={14} className="jumia-chevron" />
                </button>

                {helpOpen && (
                  <div className="jumia-dropdown-menu jumia-help-menu">
                    <ul className="jumia-menu-list">
                      <li>
                        <Link href="/#products" onClick={() => setHelpOpen(false)}>
                          <HelpIcon size={16} />
                          Help Center &amp; FAQs
                        </Link>
                      </li>
                      <li>
                        <Link href="/cart" onClick={() => setHelpOpen(false)}>
                          <CartIcon size={16} />
                          Place an Order
                        </Link>
                      </li>
                      <li>
                        <Link href="/checkout" onClick={() => setHelpOpen(false)}>
                          <StarBadgeIcon size={16} />
                          Payment Options (MoMo &amp; Card)
                        </Link>
                      </li>
                      <li>
                        <Link href="/account" onClick={() => setHelpOpen(false)}>
                          <UserIcon size={16} />
                          Track Order &amp; Delivery
                        </Link>
                      </li>
                    </ul>

                    <div className="jumia-menu-divider" />

                    <div className="jumia-help-contact-box">
                      <div className="jumia-help-phone">
                        <PhoneIcon size={16} />
                        <div>
                          <span>Call Center</span>
                          <strong>{helpInfo.phone || "030 274 0642"}</strong>
                        </div>
                      </div>
                      <span className="jumia-help-hours">
                        {helpInfo.hours || "Mon - Sun: 8am - 8pm"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link href="/cart" className="jumia-cart-btn">
                <div className="jumia-cart-icon-wrap">
                  <CartIcon size={22} />
                  {count > 0 && (
                    <span className="jumia-cart-badge">{count}</span>
                  )}
                </div>
                <span className="jumia-action-title">Cart</span>
              </Link>

              {/* Mobile Menu Burger */}
              <button
                type="button"
                className="jumia-mobile-burger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Horizontal Category Strip with Icons */}
        <nav className="jumia-category-nav" aria-label="Product categories">
          <div className="container jumia-category-inner">
            <ul className="jumia-category-list">
              {categories.map((cat) => {
                const isActive =
                  (cat.name === "All" && activeCategory === "All") ||
                  activeCategory === cat.name ||
                  activeCategory === cat.label;

                return (
                  <li key={cat.id || cat.name} className="jumia-category-item">
                    <button
                      type="button"
                      className={`jumia-category-btn ${
                        isActive ? "jumia-category-btn-active" : ""
                      }`}
                      onClick={onCategoryClick(cat.name)}
                    >
                      <span className="jumia-cat-icon">
                        <RenderCategoryIcon iconKey={cat.icon} size={18} />
                      </span>
                      <span className="jumia-cat-label">
                        {cat.label || cat.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* 5. Mobile Drawer */}
        {menuOpen && (
          <div className="jumia-mobile-drawer">
            <div className="container jumia-mobile-drawer-inner">
              {/* Mobile Search */}
              <form
                className="jumia-search-bar jumia-search-mobile"
                onSubmit={submitSearch}
              >
                <div className="jumia-search-input-wrap">
                  <SearchIcon size={18} className="jumia-search-icon" />
                  <input
                    type="search"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search products…"
                    className="jumia-search-input"
                  />
                </div>
                <button type="submit" className="jumia-search-btn">
                  Search
                </button>
              </form>

              {/* Account Quick Status */}
              <div className="jumia-drawer-account">
                {loaded && user ? (
                  <div className="jumia-drawer-user">
                    <span>Signed in as <strong>{user.name}</strong></span>
                    <Link
                      href={accountHref}
                      className="btn btn-secondary btn-sm"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="jumia-drawer-auth-row">
                    <Link href="/login" className="btn btn-primary btn-sm">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn btn-secondary btn-sm">
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Categories list with icons */}
              <div className="jumia-drawer-section">
                <h4>All Categories</h4>
                <ul className="jumia-drawer-cat-list">
                  {categories.map((cat) => (
                    <li key={cat.id || cat.name}>
                      <button
                        type="button"
                        className="jumia-drawer-cat-btn"
                        onClick={onCategoryClick(cat.name)}
                      >
                        <span className="jumia-cat-icon">
                          <RenderCategoryIcon iconKey={cat.icon} size={18} />
                        </span>
                        <span>{cat.label || cat.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick links */}
              <div className="jumia-drawer-section">
                <h4>Customer Support</h4>
                <div className="jumia-drawer-help">
                  <a
                    href={`tel:${(helpInfo.phone || "0302740642").replace(/\s+/g, "")}`}
                    className="jumia-drawer-call"
                  >
                    <PhoneIcon size={16} />
                    <span>Call to order: {helpInfo.phone || "030 274 0642"}</span>
                  </a>
                  <Link href="/cart">
                    <CartIcon size={16} /> Cart ({count})
                  </Link>
                </div>
              </div>

              {loaded && user && (
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  style={{ marginTop: 20 }}
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
