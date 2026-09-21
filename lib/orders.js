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

const normPhone = (value) => {
  let d = (value || "").replace(/[\s\-.()]/g, "");
  if (d.startsWith("+233")) d = "0" + d.slice(4);
  else if (/^233\d{9}$/.test(d)) d = "0" + d.slice(3);
  return d;
};

// Matches orders by email and/or phone so mobile-number accounts see their orders too
export function getOrdersForAccount({ email, phone } = {}) {
  const e = (email || "").trim().toLowerCase();
  const p = normPhone(phone);
  if (!e && !p) return [];
  return readOrders().filter(
    (o) =>
      (e && (o.email || "").trim().toLowerCase() === e) ||
      (p && normPhone(o.phone) === p)
  );
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
