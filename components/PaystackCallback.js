"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { saveOrder } from "@/lib/orders";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { Suspense } from "react";

const PENDING_KEY = "kamgeorge-pending-order";

function CallbackInner() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const { user } = useAuth();
  const [state, setState] = useState({ status: "loading", orderId: "", error: "" });

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setState({ status: "error", orderId: "", error: "No payment reference was returned." });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
        );
        const data = await res.json();
        if (!res.ok || data.status !== "success") {
          throw new Error(data.error || "Payment was not successful.");
        }

        let pending = null;
        try {
          pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
        } catch {
          pending = null;
        }

        const orderId = pending?.id || data.metadata?.orderId || reference;
        if (pending) {
          saveOrder({
            ...pending,
            id: orderId,
            payment: data.channel === "card" ? "card" : "momo",
            paystackReference: reference,
            paidAt: data.paidAt,
            date: pending.date || new Date().toISOString(),
          });
          sessionStorage.removeItem(PENDING_KEY);
        }

        if (!cancelled) {
          clear();
          setState({ status: "ok", orderId, error: "" });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            orderId: "",
            error: err.message || "Could not confirm payment.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clear]);

  if (state.status === "loading") {
    return (
      <div className="empty">
        <p>Confirming your Paystack payment…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="empty">
        <p className="empty-title">Payment not confirmed</p>
        <p className="muted">{state.error}</p>
        <Link href="/checkout" className="btn btn-primary">
          Back to checkout
        </Link>
      </div>
    );
  }

  const isCustomer = user && user.role === "customer";
  return (
    <div className="empty">
      <p className="success-check">✓</p>
      <p className="empty-title">Order {state.orderId} paid!</p>
      <p className="muted">
        Thank you. Your Paystack payment went through — we&apos;ll pack your order next.
      </p>
      {isCustomer ? (
        <Link href="/account" className="btn btn-primary">
          View my purchases
        </Link>
      ) : (
        <Link href="/" className="btn btn-primary">
          Back to shop
        </Link>
      )}
    </div>
  );
}

export default function PaystackCallback() {
  return (
    <Suspense
      fallback={
        <div className="empty">
          <p>Confirming your Paystack payment…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
