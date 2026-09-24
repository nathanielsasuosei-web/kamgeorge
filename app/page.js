import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        <picture>
          <source
            type="image/webp"
            srcSet="/hero-640.webp 640w, /hero-960.webp 960w, /hero-1600.webp 1600w, /hero-8k.webp 7680w"
            sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1160px) calc(100vw - 40px), 1080px"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-1600.webp"
            srcSet="/hero-640.webp 640w, /hero-960.webp 960w, /hero-1600.webp 1600w, /hero-8k.webp 7680w"
            sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1160px) calc(100vw - 40px), 1080px"
            alt="KamGeorge — chrome Kam·G bull emblem"
            width={7680}
            height={7680}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </section>

      <ProductGrid />
    </>
  );
}
