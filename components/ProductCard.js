"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/components/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="card">
      <Link href={`/products/${product.id}`} className="card-media">
        {product.badge && (
          <span className={`badge badge-${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <Link href={`/products/${product.id}`} className="card-title">
          {product.name}
        </Link>
        <p className="card-rating">
          <span className="stars">★ {product.rating.toFixed(1)}</span>
          <span className="reviews">({product.reviews})</span>
        </p>
        <div className="card-row">
          <p className="price">
            {formatPrice(product.price)}{" "}
            {product.oldPrice && (
              <s className="old-price">{formatPrice(product.oldPrice)}</s>
            )}
          </p>
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={() => addItem(product.id)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
