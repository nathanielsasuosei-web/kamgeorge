import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="brand-mark">K</span>
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
            <li>Delivery in 1–3 days</li>
            <li>Mobile Money &amp; card accepted</li>
            <li>7-day easy returns</li>
            <li>hello@kamgeorge.com</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} KamGeorge. All rights reserved.</span>
      </div>
    </footer>
  );
}
