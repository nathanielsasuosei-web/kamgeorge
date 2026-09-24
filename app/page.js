import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.imgur.com/4cE4rxl_d.webp?maxwidth=1280&fidelity=grand"
          srcSet="https://i.imgur.com/4cE4rxl_d.webp?maxwidth=640&fidelity=grand 640w, https://i.imgur.com/4cE4rxl_d.webp?maxwidth=960&fidelity=grand 960w, https://i.imgur.com/4cE4rxl_d.webp?maxwidth=1280&fidelity=grand 1280w"
          sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1160px) calc(100vw - 40px), 1080px"
          alt="KamGeorge chrome bull and silver wordmark"
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
