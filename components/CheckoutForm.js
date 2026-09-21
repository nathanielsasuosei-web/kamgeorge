"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/components/CartContext";

const DELIVERY_FEE = 50;

export default function CheckoutForm() {
  const { items, subtotal, clear, loaded } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Accra",
    payment: "momo",
  });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setOrderId(`KG-${Math.floor(100000 + Math.random() * 900000)}`);
    setPlaced(true);
    clear();
  };

  if (!loaded) {
    return <div className="empty"><p>Loading checkout…</p></div>;
  }

  if (placed) {
    return (
      <div className="empty">
        <p className="success-check">✓</p>
        <p className="empty-title">Order {orderId} confirmed!</p>
        <p className="muted">
          Thank you, {form.name || "shopper"}. We&apos;ll call {form.phone || "you"} to
          confirm delivery to {form.city}.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to shop
        </Link>
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
        <div className="radio-group">
          <label className="radio">
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={form.payment === "momo"}
              onChange={update("payment")}
            />
            Mobile Money
          </label>
          <label className="radio">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={form.payment === "card"}
              onChange={update("payment")}
            />
            Card
          </label>
          <label className="radio">
            <input
              type="radio"
              name="payment"
              value="pod"
              checked={form.payment === "pod"}
              onChange={update("payment")}
            />
            Pay on delivery
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Place order — {formatPrice(subtotal + DELIVERY_FEE)}
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
