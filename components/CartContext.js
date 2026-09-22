"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProducts } from "@/components/ProductsContext";

const CartContext = createContext(null);
const STORAGE_KEY = "kamgeorge-cart";

export function CartProvider({ children }) {
  const { getProduct } = useProducts();
  const [items, setItems] = useState([]); // [{ id, qty }]
  const [loaded, setLoaded] = useState(false);

  // Load persisted cart on mount (client only, avoids hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter((i) => i && typeof i.id === "string")
              .map((i) => ({
                id: i.id,
                qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
              }))
          );
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  // Persist cart on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items, loaded]);

  const value = useMemo(() => {
    // Only show items that still exist in the (possibly manager-edited) catalog
    const detailed = items
      .map((i) => ({
        ...i,
        product: getProduct(i.id),
      }))
      .filter((i) => i.product);
    const count = detailed.reduce((sum, i) => sum + (i.qty || 0), 0);
    const subtotal = detailed.reduce(
      (sum, i) => sum + i.product.price * i.qty,
      0
    );

    const addItem = (id, qty = 1) => {
      if (!getProduct(id)) return;
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) {
          return prev.map((i) =>
            i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
          );
        }
        return [...prev, { id, qty }];
      });
    };

    const removeItem = (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const setQty = (id, qty) => {
      const q = Math.max(0, Math.min(99, Number(qty) || 0));
      if (q === 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: q } : i)));
    };

    const clear = () => setItems([]);

    return { items: detailed, count, subtotal, addItem, removeItem, setQty, clear, loaded };
  }, [items, loaded, getProduct]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
