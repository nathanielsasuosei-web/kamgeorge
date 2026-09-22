"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({ id, qty = 1, label = "Add to cart" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    addItem(id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={added ? "btn btn-success btn-block" : "btn btn-primary btn-block"}
      onClick={handle}
    >
      {added ? "✓ Added to cart" : label}
    </button>
  );
}
