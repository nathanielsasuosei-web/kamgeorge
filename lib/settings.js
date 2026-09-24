// Site-wide editable settings stored in localStorage via SettingsContext.

export const DEFAULT_TOP_BANNER = {
  enabled: true,
  tagline: "BACK TO SCHOOL",
  badge: "UP TO 60% OFF",
  phoneLabel: "CALL TO ORDER",
  phone: "030 274 0642",
  buttonText: "SHOP NOW",
  buttonLink: "/#products",
  bgColor: "#0062ff",
  textColor: "#ffffff",
};

export const DEFAULT_SUB_HEADER = {
  enabled: true,
  sellText: "Sell on KamGeorge",
  sellLink: "/register",
  brandBadge: "KAMGEORGE★",
  features: ["PAY", "DELIVERY", "EXPRESS"],
};

export const DEFAULT_HERO_SLIDES = [
  {
    id: "slide-1",
    badge: "KAMGEORGE BACK TO SCHOOL",
    title: "Smart Essentials for Less",
    subtitle: "Up to 60% off · Limited quantity",
    buttonText: "Shop Now →",
    buttonLink: "/#products",
    disclaimer: "T&Cs apply",
    bgColor: "#0062ff",
    theme: "blue",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    active: true,
  },
  {
    id: "slide-2",
    badge: "TECH & ELECTRONICS",
    title: "Next-Gen Audio & Smart Tech",
    subtitle: "Noise-cancelling headphones, cameras & gadgets",
    buttonText: "Shop Electronics →",
    buttonLink: "/?c=Electronics#products",
    disclaimer: "Free express delivery nationwide",
    bgColor: "#1e293b",
    theme: "dark",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    active: true,
  },
  {
    id: "slide-3",
    badge: "HOME & APPLIANCES",
    title: "Modern Essentials for Your Home",
    subtitle: "Up to 40% off smart appliances, lighting & modern decor",
    buttonText: "Shop Appliances →",
    buttonLink: "/?c=Appliances#products",
    disclaimer: "7-day easy returns on all items",
    bgColor: "#e05300",
    theme: "orange",
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80",
    active: true,
  },
];

export const DEFAULT_CATEGORIES = [
  { id: "all", name: "All", label: "Official Stores", icon: "store" },
  { id: "home", name: "Home", label: "Home & Office", icon: "home" },
  { id: "appliances", name: "Appliances", label: "Appliances", icon: "appliances" },
  { id: "electronics", name: "Electronics", label: "Electronics", icon: "electronics" },
];

export const DEFAULT_HELP_INFO = {
  phone: "030 274 0642",
  email: "hello@kamgeorge.com",
  whatsapp: "+233302740642",
  hours: "Mon - Sun: 8:00 AM – 8:00 PM",
  location: "Accra, Ghana",
};

export const DEFAULT_SETTINGS = {
  support: [
    "Delivery in 1–3 days",
    "Mobile Money payments",
    "7-day easy returns",
    "hello@kamgeorge.com",
  ],
  topBanner: DEFAULT_TOP_BANNER,
  subHeader: DEFAULT_SUB_HEADER,
  heroSlides: DEFAULT_HERO_SLIDES,
  categories: DEFAULT_CATEGORIES,
  helpInfo: DEFAULT_HELP_INFO,
};

export const SUPPORT_STORAGE_KEY = "kamgeorge-site-settings";

// Keep only non-empty text lines, so a stray edit can't break the footer.
export function sanitizeSupportList(value) {
  if (!Array.isArray(value)) return null;
  const lines = value
    .filter((line) => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);
  return lines.length ? lines : null;
}
