import { getProduct, products } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

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

// Server shell — the detail itself renders client-side so it always reflects
// the current (possibly manager-edited) catalog.
export default function ProductPage({ params }) {
  return <ProductDetail id={params.id} />;
}
