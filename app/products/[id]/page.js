import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, products } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const product = getProduct(params.id);
  if (!product) return { title: "Product not found — KamGeorge" };
  return {
    title: `${product.name} — KamGeorge`,
    description: product.description,
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();

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
            <li>✓ Pay with Mobile Money, card or on delivery</li>
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
