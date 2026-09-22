"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/components/CartContext";

const DELIVERY_FEE = 50;

export default function CartView() {
  const { items, subtotal, setQty, removeItem, clear, loaded } = useCart();

  if (!loaded) {
    return <div className="empty"><p>Loading your cart…</p></div>;
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="empty-title">Your cart is empty</p>
        <p className="muted">Browse the shop and add something you love.</p>
        <Link href="/" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="cart-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="cart-thumb" />
            <div className="cart-info">
              <Link href={`/products/${product.id}`} className="cart-name">
                {product.name}
              </Link>
              <p className="muted">{formatPrice(product.price)} each</p>
              <div className="qty-row">
                <button
                  className="qty-btn"
                  onClick={() => setQty(product.id, qty - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(product.id, qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <button
                  className="link-danger"
                  onClick={() => removeItem(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="cart-line-total">{formatPrice(product.price * qty)}</p>
          </div>
        ))}
        <button className="link-danger" onClick={clear}>
          Clear cart
        </button>
      </div>

      <aside className="summary">
        <h3>Order summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(subtotal + DELIVERY_FEE)}</span>
        </div>
        <Link href="/checkout" className="btn btn-primary btn-block">
          Proceed to checkout
        </Link>
        <Link href="/" className="btn btn-secondary btn-block">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
