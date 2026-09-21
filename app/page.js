import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import {
  BagIcon,
  GlassesIcon,
  HeadphonesIcon,
  MobileIcon,
  ReturnsIcon,
  TruckIcon,
  WatchIcon,
} from "@/components/icons";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">New arrivals every week</span>
          <h1>Quality essentials, delivered to your door.</h1>
          <p className="muted">
            Electronics, fashion, home and beauty — hand-picked, fairly priced
            and delivered across Ghana in 1–3 days.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">
              Shop now
            </a>
            <Link href="/cart" className="btn btn-secondary">
              View cart
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>12+</strong>
              <span>Curated products</span>
            </div>
            <div>
              <strong>1–3 days</strong>
              <span>Nationwide delivery</span>
            </div>
            <div>
              <strong>4.8★</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card hero-card-1">
            <HeadphonesIcon size={52} />
          </div>
          <div className="hero-card hero-card-2">
            <WatchIcon size={52} />
          </div>
          <div className="hero-card hero-card-3">
            <BagIcon size={52} />
          </div>
          <div className="hero-card hero-card-4">
            <GlassesIcon size={52} />
          </div>
        </div>
      </section>

      <ProductGrid />

      <section className="perks">
        <div className="perk">
          <span className="perk-icon">
            <TruckIcon size={28} />
          </span>
          <h3>Fast delivery</h3>
          <p>1–3 days nationwide with live order updates.</p>
        </div>
        <div className="perk">
          <span className="perk-icon">
            <MobileIcon size={28} />
          </span>
          <h3>Pay your way</h3>
          <p>Mobile Money, cards or pay on delivery.</p>
        </div>
        <div className="perk">
          <span className="perk-icon">
            <ReturnsIcon size={28} />
          </span>
          <h3>Easy returns</h3>
          <p>7-day no-questions returns on every order.</p>
        </div>
      </section>
    </>
  );
}
