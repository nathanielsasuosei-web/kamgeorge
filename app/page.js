import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.imgur.com/2gOTGR5_d.webp"
          alt="KamGeorge store banner"
        />
      </section>

      <ProductGrid />
    </>
  );
}
