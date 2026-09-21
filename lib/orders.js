const STORAGE_KEY = "kamgeorge-orders";

export function readOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  try {
    const orders = readOrders();
    orders.unshift(order); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // storage unavailable
  }
}

export function getOrdersByEmail(email) {
  const clean = (email || "").trim().toLowerCase();
  if (!clean) return [];
  return readOrders().filter((o) => o.email === clean);
}

// Demo fulfilment status derived from order age
export function orderStatus(dateIso) {
  const ageDays = (Date.now() - new Date(dateIso).getTime()) / 86400000;
  if (ageDays < 1) return "Processing";
  if (ageDays < 3) return "In transit";
  return "Delivered";
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatOrderDate(dateIso) {
  try {
    return dateFmt.format(new Date(dateIso));
  } catch {
    return "";
  }
}

const PAYMENT_LABELS = {
  momo: "Mobile Money",
  card: "Card",
  pod: "Pay on delivery",
};

export function paymentLabel(method) {
  return PAYMENT_LABELS[method] || method;
}
