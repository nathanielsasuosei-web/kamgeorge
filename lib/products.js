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
    id: "chrono-watch",
    name: "Minimalist Chrono Watch",
    price: 2300,
    oldPrice: null,
    category: "Fashion",
    rating: 4.9,
    reviews: 98,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description:
      "A timeless chronograph with sapphire-coated glass, genuine leather strap and 5ATM water resistance.",
  },
  {
    id: "runner-sneakers",
    name: "Runner Street Sneakers",
    price: 1899,
    oldPrice: 2299,
    category: "Fashion",
    rating: 4.7,
    reviews: 342,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description:
      "Lightweight street runners with responsive foam soles and breathable knit uppers. Built for all-day comfort.",
  },
  {
    id: "aviator-sunglasses",
    name: "Aviator Sunglasses",
    price: 750,
    oldPrice: null,
    category: "Fashion",
    rating: 4.6,
    reviews: 187,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    description:
      "Classic aviators with polarized UV400 lenses and a featherlight metal frame. Includes hard case and cloth.",
  },
  {
    id: "voyager-backpack",
    name: "Voyager Canvas Backpack",
    price: 980,
    oldPrice: null,
    category: "Fashion",
    rating: 4.8,
    reviews: 156,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description:
      "Waxed-canvas 22L backpack with padded 15-inch laptop sleeve, brass fittings and water-repellent coating.",
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
    id: "noir-parfum",
    name: "Noir Eau de Parfum 50ml",
    price: 860,
    oldPrice: null,
    category: "Beauty",
    rating: 4.9,
    reviews: 431,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    description:
      "Smoky oud, amber and vanilla in a long-lasting 50ml flacon. Unisex, bold and unforgettable.",
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
  {
    id: "denim-jacket",
    name: "Denim Trucker Jacket",
    price: 1320,
    oldPrice: 1600,
    category: "Fashion",
    rating: 4.5,
    reviews: 112,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    description:
      "Rugged 12oz denim trucker with copper rivets and a relaxed fit that breaks in beautifully with wear.",
  },
];

export const categories = ["All", "Electronics", "Fashion", "Home", "Beauty"];

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
