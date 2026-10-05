import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt="Unclaim hero image"
          width={1280}
          height={1280}
          fetchPriority="high"
          decoding="async"
        />
      </section>

      <ProductGrid />
    </>
  );
}
