"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

const DELIVERY_FEE = 50;
const PENDING_KEY = "kamgeorge-pending-order";

export default function CheckoutForm() {
  const { items, subtotal, clear, loaded } = useCart();
  const { user } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Accra",
    payment: "momo",
  });

  // Prefill contact details for logged-in customers
  useEffect(() => {
    if (user && user.role === "customer") {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
        email: f.email || user.email,
        phone: f.phone || user.phone,
      }));
    }
  }, [user]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setPayError("");
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setPayError("Email is required so Paystack can send a receipt.");
      return;
    }
    const id = `KG-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = subtotal + DELIVERY_FEE;
    const order = {
      id,
      email,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      payment: "paystack",
      items: items.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        qty,
        image: product.image,
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      date: new Date().toISOString(),
    };

    setPaying(true);
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(order));
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: total,
          orderId: id,
          metadata: { name: order.name, phone: order.phone, city: order.city },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Could not start Paystack checkout.");
      }
      window.location.href = data.authorizationUrl;
    } catch (err) {
      sessionStorage.removeItem(PENDING_KEY);
      setPayError(err.message || "Payment failed to start.");
      setPaying(false);
    }
  };

  if (!loaded) {
    return <div className="empty"><p>Loading checkout…</p></div>;
  }

  if (placed) {
    const isCustomer = user && user.role === "customer";
    return (
      <div className="empty">
        <p className="success-check">✓</p>
        <p className="empty-title">Order {orderId} confirmed!</p>
        <p className="muted">
          Thank you, {form.name || "shopper"}. We&apos;ll call {form.phone || "you"} to
          confirm delivery to {form.city}.
        </p>
        {isCustomer ? (
          <Link href="/account" className="btn btn-primary">
            View my purchases
          </Link>
        ) : (
          <>
            <Link href="/" className="btn btn-primary">
              Back to shop
            </Link>
            <p className="auth-switch muted">
              Want to track this order?{" "}
              <Link href="/register">Create an account</Link> with this email or number.
            </p>
          </>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="empty-title">Nothing to check out</p>
        <p className="muted">Your cart is empty.</p>
        <Link href="/" className="btn btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  const canCheckout = user && user.role === "customer";
  if (!canCheckout) {
    return (
      <div className="auth-wrap">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2>Account required</h2>
          <p className="muted">
            Please log in or create an account to place your order. Your cart
            is saved — you&apos;ll return here afterwards.
          </p>
          <div className="form-row">
            <Link className="btn btn-secondary" href="/login?next=/checkout">
              Log in
            </Link>
            <Link className="btn btn-primary" href="/register?next=/checkout">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <form className="checkout-form" onSubmit={submit}>
        <h3>Delivery details</h3>
        <label>
          Full name
          <input
            className="input"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="e.g. Ama Serwaa"
          />
        </label>
        <label>
          Email (required for Paystack receipt)
          <input
            className="input"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Phone number
          <input
            className="input"
            required
            value={form.phone}
            onChange={update("phone")}
            placeholder="e.g. 024 123 4567"
          />
        </label>
        <label>
          Delivery address
          <input
            className="input"
            required
            value={form.address}
            onChange={update("address")}
            placeholder="Street, landmark…"
          />
        </label>
        <label>
          City
          <input
            className="input"
            required
            value={form.city}
            onChange={update("city")}
          />
        </label>

        <h3>Payment method</h3>
        <div className="momo-box">
          <strong>Paystack</strong>
          <p className="muted">
            Pay securely with Mobile Money (MTN, Telecel, AirtelTigo) or card.
            You&apos;ll be redirected to Paystack to complete payment.
          </p>
        </div>

        {payError ? <p className="muted" role="alert">{payError}</p> : null}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={paying}
        >
          {paying
            ? "Redirecting to Paystack…"
            : `Pay with Paystack — ${formatPrice(subtotal + DELIVERY_FEE)}`}
        </button>
      </form>

      <aside className="summary">
        <h3>Your order</h3>
        {items.map(({ product, qty }) => (
          <div key={product.id} className="summary-row">
            <span>
              {product.name} × {qty}
            </span>
            <span>{formatPrice(product.price * qty)}</span>
          </div>
        ))}
        <div className="summary-row">
          <span>Delivery</span>
          <span>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(subtotal + DELIVERY_FEE)}</span>
        </div>
      </aside>
    </div>
  );
}
