"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function AccountView() {
  const { user, loaded, logout } = useAuth();
  const router = useRouter();

  if (!loaded) {
    return (
      <div className="empty">
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty">
        <p className="empty-title">You&apos;re not logged in</p>
        <p className="muted">Log in or create an account to continue.</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link href="/login" className="btn btn-primary">
            Log in
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (user.role === "manager") {
    return (
      <div className="empty">
        <p className="empty-title">Signed in as store manager</p>
        <p className="muted">{user.email}</p>
        <Link href="/admin" className="btn btn-primary">
          Go to manage store
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="checkout-form account-card">
      <h3>My account</h3>
      <div className="summary-row">
        <span>Name</span>
        <span>{user.name}</span>
      </div>
      <div className="summary-row">
        <span>Email</span>
        <span>{user.email}</span>
      </div>
      <div className="summary-row">
        <span>Checkout</span>
        <span>Your name is prefilled automatically</span>
      </div>
      <Link href="/" className="btn btn-primary btn-block">
        Continue shopping
      </Link>
      <button className="btn btn-secondary btn-block" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
