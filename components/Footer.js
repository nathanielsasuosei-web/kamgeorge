import Link from "next/link";
import { LockIcon, MobileIcon, ReturnsIcon, TruckIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="https://i.imgur.com/RsY4DbC_d.webp" alt="KamGeorge logo" />
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
            <li>Mobile Money payments</li>
            <li>7-day easy returns</li>
            <li>hello@kamgeorge.com</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} KamGeorge. All rights reserved.</span>
        <Link href="/admin/login" className="footer-admin">
          <LockIcon size={13} /> Store manager
        </Link>
      </div>
      <div className="trust-strip">
        <div className="container trust-strip-inner">
          <div className="trust-item">
            <TruckIcon size={22} />
            <div>
              <strong>Fast delivery</strong>
              <span>1–3 days nationwide with live order updates.</span>
            </div>
          </div>
          <div className="trust-item">
            <MobileIcon size={22} />
            <div>
              <strong>MoMo payments</strong>
              <span>Fast, secure Mobile Money checkout.</span>
            </div>
          </div>
          <div className="trust-item">
            <ReturnsIcon size={22} />
            <div>
              <strong>Easy returns</strong>
              <span>7-day no-questions returns on every order.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
