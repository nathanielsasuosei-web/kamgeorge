import ProductGrid from "@/components/ProductGrid";
import { MobileIcon, ReturnsIcon, TruckIcon } from "@/components/icons";

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
