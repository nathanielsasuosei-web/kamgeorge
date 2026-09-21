"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, userIdentifier } from "@/components/AuthContext";
import { BagIcon } from "@/components/icons";
import { formatPrice } from "@/lib/products";
import {
  formatOrderDate,
  getOrdersForAccount,
  orderStatus,
  paymentLabel,
} from "@/lib/orders";

export default function AccountView() {
  const { user, loaded, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (loaded && user && user.role === "customer") {
      setOrders(getOrdersForAccount({ email: user.email, phone: user.phone }));
    }
  }, [loaded, user]);

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
        <p className="muted">{userIdentifier(user)}</p>
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

  const initial = (user.name || "C").trim().charAt(0).toUpperCase();
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <div className="profile-card">
        <div className="avatar">{initial}</div>
        <div className="profile-info">
          <h2>
            {user.name} <span className="pill-customer">Customer</span>
          </h2>
          <p className="muted">{userIdentifier(user)}</p>
          <div className="profile-stats">
            <div>
              <strong>{orders.length}</strong>
              <span>Order{orders.length === 1 ? "" : "s"}</span>
            </div>
            <div>
              <strong>{formatPrice(totalSpent)}</strong>
              <span>Total spent</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <Link href="/" className="btn btn-primary">
            Continue shopping
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <section className="section">
        <h2>My purchases</h2>
        {orders.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <BagIcon size={30} />
            </div>
            <p className="empty-title">No purchases yet</p>
            <p className="muted">
              Your orders will appear here once you check out.
            </p>
            <Link href="/" className="btn btn-primary">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="orders">
            {orders.map((o) => {
              const status = orderStatus(o.date);
              const statusClass = `status-${status
                .toLowerCase()
                .replace(" ", "-")}`;
              return (
                <article key={o.id} className="order-card">
                  <div className="order-head">
                    <div>
                      <strong>{o.id}</strong>
                      <span className="muted">
                        {" "}
                        · {formatOrderDate(o.date)}
                      </span>
                    </div>
                    <span className={`status ${statusClass}`}>{status}</span>
                  </div>
                  <div className="order-items">
                    {o.items.map((item) => (
                      <div key={item.id} className="order-item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" />
                        <span className="order-item-name">
                          {item.name} × {item.qty}
                        </span>
                        <span className="order-item-total">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="order-foot">
                    <span className="muted">
                      {paymentLabel(o.payment)} · Deliver to {o.city}
                    </span>
                    <span className="order-total">
                      Total: {formatPrice(o.total)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
