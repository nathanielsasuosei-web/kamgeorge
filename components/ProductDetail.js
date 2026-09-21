"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useProducts } from "@/components/ProductsContext";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail({ id }) {
  const { getProduct, products, loaded } = useProducts();

  if (!loaded) {
    return (
      <div className="empty">
        <p>Loading product…</p>
      </div>
    );
  }

  const product = getProduct(id);

  if (!product) {
    return (
      <div className="empty">
        <p className="empty-title">Product not available</p>
        <p className="muted">This item may have been removed from the store.</p>
        <Link href="/" className="btn btn-primary">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <Link href="/" className="back-link">
        ← Back to shop
      </Link>
      <div className="detail">
        <div className="detail-media">
          {product.badge && (
            <span className={`badge badge-${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <p className="card-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="card-rating">
            <span className="stars">★ {product.rating.toFixed(1)}</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </p>
          <p className="detail-price">
            {formatPrice(product.price)}{" "}
            {product.oldPrice && (
              <s className="old-price">{formatPrice(product.oldPrice)}</s>
            )}
          </p>
          <p className="muted">{product.description}</p>
          <AddToCartButton id={product.id} />
          <ul className="detail-points">
            <li>✓ In stock — ships within 24 hours</li>
            <li>✓ 7-day easy returns</li>
            <li>✓ Pay securely with Mobile Money</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>You may also like</h2>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
