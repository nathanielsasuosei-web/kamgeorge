export const products = [
  {
    id: "aurora-headphones",
    name: "Aurora Wireless Headphones",
    price: 1450,
    oldPrice: null,
    category: "Electronics",
    rating: 4.8,
    reviews: 214,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description:
      "Over-ear noise-cancelling headphones with 40-hour battery life, plush memory-foam cushions and crystal-clear call quality.",
  },
  {
    id: "air-fryer-pro",
    name: "Smart Digital Air Fryer 5.5L",
    price: 1680,
    oldPrice: 1950,
    category: "Appliances",
    rating: 4.9,
    reviews: 287,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",
    description:
      "Rapid 360° air circulation, 8 preset touch modes, non-stick dishwasher-safe basket with low energy consumption.",
  },
  {
    id: "instant-camera",
    name: "Instant Film Camera",
    price: 3200,
    oldPrice: null,
    category: "Electronics",
    rating: 4.5,
    reviews: 76,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    description:
      "Point, shoot and print. Retro-styled instant camera with auto exposure, selfie mirror and credit-card sized prints.",
  },
  {
    id: "boom-speaker",
    name: "Boom Portable Speaker",
    price: 1150,
    oldPrice: null,
    category: "Electronics",
    rating: 4.7,
    reviews: 268,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    description:
      "Room-filling 360° sound, deep bass, 24-hour playtime and IPX7 waterproofing. Pair two for true stereo.",
  },
  {
    id: "ergo-lounge-chair",
    name: "Ergo Lounge Chair",
    price: 5400,
    oldPrice: null,
    category: "Home",
    rating: 4.6,
    reviews: 54,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    description:
      "Sculptural lounge chair with solid wood legs and premium bouclé upholstery. Assembles in under 10 minutes.",
  },
  {
    id: "halo-desk-lamp",
    name: "Halo Desk Lamp",
    price: 640,
    oldPrice: null,
    category: "Home",
    rating: 4.7,
    reviews: 189,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    description:
      "Dimmable LED desk lamp with warm-to-cool temperature control, touch sensor and USB-C charging port.",
  },
  {
    id: "mech-keyboard",
    name: "Mech Keyboard 75%",
    price: 1750,
    oldPrice: null,
    category: "Electronics",
    rating: 4.8,
    reviews: 143,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description:
      "Gasket-mounted 75% mechanical keyboard with hot-swappable switches, PBT keycaps and tri-mode connectivity.",
  },
];

export const categories = [
  "All",
  "Home",
  "Appliances",
  "Electronics",
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

const ghs = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
});

export function formatPrice(value) {
  return ghs.format(value);
}
