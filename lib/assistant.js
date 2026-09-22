// Little George — rule-based customer assistant brain.
// Pure functions only (safe to run on server or client).

export const SUGGESTIONS = [
  "Track my order",
  "Delivery info",
  "Payment options",
  "Any discounts?",
  "What do you sell?",
];

const STOP = new Set(
  "the,a,an,and,are,you,your,yours,doe,does,have,has,had,sell,sells,any,for,with,that,this,those,these,from,there,their,they,them,then,than,show,shows,looking,look,buy,buying,want,wants,need,needs,get,getting,like,liked,please,price,prices,cost,costs,much,many,how,what,when,where,which,who,whom,about,into,over,under,again,once,here,also,just,very,can,could,should,would,will,shall,may,might,must,not,now,today,all,some,more,most,other,such,only,same,too,add,cart,order,item,items,thing,things,something,anything,everything,store,shop,online,website,hello,thanks,thank,kind,kinds,type,types".split(
    ","
  )
);

// Naive singular variants so "watches" matches "Watch", "lamps" matches "Lamp", etc.
function variants(token) {
  const v = [token];
  if (token.endsWith("es") && token.length > 4) v.push(token.slice(0, -2));
  if (token.endsWith("s") && token.length > 3) v.push(token.slice(0, -1));
  return v;
}

function findProducts(text, products) {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
  if (tokens.length === 0) return [];

  const intent = /(buy|shop|look|price|cost|much|availab|have|sell|recom|need|want|show|find|search|get|deal)/.test(
    text.toLowerCase()
  );
  const min = intent ? 2 : 3;

  return products
    .map((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      const desc = (p.description || "").toLowerCase();
      let score = 0;
      for (const t of tokens) {
        const forms = variants(t);
        if (forms.some((x) => name.includes(x))) score += 3;
        else if (forms.some((x) => cat.includes(x))) score += 2;
        else if (forms.some((x) => desc.includes(x))) score += 1;
      }
      return { p, score };
    })
    .filter((s) => s.score >= min)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.p);
}

function byBadge(products, badge) {
  return products
    .filter((p) => (p.badge || "").toLowerCase() === badge)
    .slice(0, 3);
}

export function getAssistantReply(input, { products = [], user = null } = {}) {
  const text = (input || "").toLowerCase().trim();
  const has = (...words) => words.some((w) => text.includes(w));

  // Identity
  if (has("your name", "who are you", "about yourself", "little george")) {
    return {
      text: "I'm Little George — your friendly shopping assistant here at KamGeorge!\nAsk me about products, prices, delivery, payments, returns or tracking your order.",
    };
  }

  // Order tracking
  if (
    has(
      "track",
      "where is my order",
      "where's my order",
      "order status",
      "my order",
      "my purchase",
      "delivery status"
    )
  ) {
    if (user && user.role === "customer") {
      const first = user.name.split(" ")[0];
      return {
        text: `Great news, ${first} — every order you place is saved to your account with a live status:\n• Processing → In transit → Delivered\n\nTap below to see them all:`,
        links: [{ label: "My purchases", href: "/account" }],
      };
    }
    return {
      text: "You can track every order from your account page — each one shows a live status (Processing → In transit → Delivered).\nLog in or create a free account to see yours:",
      links: [
        { label: "My purchases", href: "/account" },
        { label: "Create account", href: "/register" },
      ],
    };
  }

  // Delivery
  if (
    has(
      "deliver",
      "shipping",
      "ships",
      "dispatch",
      "how long",
      "arrival",
      "arrive"
    )
  ) {
    return {
      text: "We deliver nationwide across Ghana in 1–3 days.\n• Delivery fee: GH₵50 per order\n• Orders ship within 24 hours\n• Pay in seconds with Mobile Money!",
    };
  }

  // Payment
  if (
    has(
      "pay",
      "momo",
      "mobile money",
      "card",
      "cash",
      "mtn",
      "vodafone",
      "telecel",
      "airteltigo"
    )
  ) {
    return {
      text: "We accept Mobile Money only — MTN, Telecel and AirtelTigo.\nAfter checkout you'll receive a prompt on your phone to approve payment. Fast and secure!\n\nPlease note: we don't accept cards or cash.",
    };
  }

  // Returns
  if (has("return", "refund", "exchange", "change my mind")) {
    return {
      text: "No worries — we offer easy 7-day returns, no questions asked.\nJust email hello@kamgeorge.com with your order number and we'll sort you out.",
    };
  }

  // Stock
  if (has("in stock", "stock", "availability", "restock")) {
    return {
      text: "Everything you see in the shop is in stock and ships within 24 hours!\nTell me what you're looking for, or browse it all here:",
      links: [{ label: "Browse everything", href: "/" }],
    };
  }

  // Contact / humans ("phone" uses a word boundary so "headphones" doesn't match)
  if (
    has(
      "contact",
      "human",
      "support",
      "email",
      "call",
      "whatsapp",
      "agent",
      "someone",
      "talk to"
    ) ||
    /\bphones?\b/.test(text)
  ) {
    return {
      text: "Our human team is at hello@kamgeorge.com — we reply within a day.\nI'm also here 24/7 for quick answers about the shop!",
    };
  }

  // My account
  if (has("my account")) {
    if (user && user.role === "customer") {
      return {
        text: `You're logged in as ${user.name} (${user.email || user.phone}). Here's your account:`,
        links: [{ label: "My account", href: "/account" }],
      };
    }
    return {
      text: "You can view your details and purchases on your account page:",
      links: [
        { label: "My account", href: "/account" },
        { label: "Create account", href: "/register" },
      ],
    };
  }

  // Register
  if (
    has(
      "register",
      "sign up",
      "signup",
      "create account",
      "new account",
      "open an account",
      "account"
    )
  ) {
    return {
      text: "Creating an account takes seconds — faster checkout plus full purchase history. Ready?",
      links: [
        { label: "Create account", href: "/register" },
        { label: "Log in", href: "/login" },
      ],
    };
  }

  // Login
  if (has("log in", "login", "log-in", "sign in", "signin")) {
    return {
      text: "You can log in to your customer account here:",
      links: [{ label: "Log in", href: "/login" }],
    };
  }

  // Categories / what we sell (checked before sale/new so "what do you offer" wins)
  if (
    has(
      "what do you sell",
      "what do you have",
      "what do you offer",
      "categories",
      "category",
      "sell?",
      "products"
    )
  ) {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const lines = Object.entries(counts)
      .map(([c, n]) => `• ${c} (${n})`)
      .join("\n");
    return {
      text: `Here's what we sell:\n${lines}\n\nTell me what you're looking for — e.g. "headphones" or "lamp"!`,
      links: [{ label: "Browse everything", href: "/" }],
    };
  }

  // Sale / discounts ("offers" plural so "what do you offer" doesn't match)
  if (has("sale", "discount", "promo", "offers", "deal", "cheap", "cheaper")) {
    const matches = findProducts(text, products);
    if (matches.length > 0) {
      return {
        text: "Here are the cheapest matches I found.\nTap + to add to cart.",
        products: [...matches].sort((a, b) => a.price - b.price),
      };
    }
    const items = byBadge(products, "sale");
    if (items.length === 0)
      return {
        text: "No sale items right now — but new deals land every week, so check back soon!",
      };
    return {
      text: "On sale right now — grab them before they're gone!\nTap + to add to cart.",
      products: items,
    };
  }

  // New arrivals (bare "new" as a whole word; product queries like "new watch" win)
  if (
    has(
      "new arrival",
      "newest",
      "latest",
      "just landed",
      "new product",
      "what's new",
      "whats new"
    ) ||
    /\bnew\b/.test(text)
  ) {
    const matches = findProducts(text, products);
    if (matches.length > 0) {
      return {
        text: "Here's what I found.\nTap + to add to cart, or tap a name for details.",
        products: matches,
      };
    }
    const items = byBadge(products, "new");
    if (items.length === 0)
      return { text: "Fresh arrivals land every week — check back soon!" };
    return {
      text: "Check out our latest arrivals!\nTap + to add to cart.",
      products: items,
    };
  }

  // Bestsellers / recommendations
  if (
    has(
      "bestseller",
      "best seller",
      "popular",
      "recommend",
      "favourite",
      "favorite",
      "top rated",
      "best product"
    )
  ) {
    const matches = findProducts(text, products);
    if (matches.length > 0) {
      return {
        text: "Good choice! Here's what I found.\nTap + to add to cart, or tap a name for details.",
        products: matches,
      };
    }
    let items = byBadge(products, "bestseller");
    if (items.length === 0)
      items = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
    return {
      text: "Customer favourites, loved and highly rated!\nTap + to add to cart.",
      products: items,
    };
  }

  // Location / hours
  if (has("location", "located", "address", "accra", "ghana", "open", "hours")) {
    return {
      text: "We're an online store based in Accra, delivering all across Ghana.\n• Open 24/7 online\n• Support: hello@kamgeorge.com",
    };
  }

  // Admin / manager — deflect, never reveal credentials or links
  if (has("admin", "manager", "manage store", "dashboard")) {
    return {
      text: "I can only help with shopping questions!\nIf you're a store manager, please use the Store manager link at the very bottom of the page.",
    };
  }

  // Product search across the live catalog
  const matches = findProducts(text, products);
  if (matches.length > 0) {
    return {
      text: "Here's what I found.\nTap + to add to cart, or tap a name for details.",
      products: matches,
    };
  }
  if (
    /(buy|shop|looking for|show|price|cost|much|availab|have|sell|need|want|find|search|recommend)/.test(
      text
    )
  ) {
    return {
      text: "I couldn't find that in our catalog.\nTry words like headphones, sneakers, lamp or watch — or browse everything here:",
      links: [{ label: "Browse everything", href: "/" }],
    };
  }

  // Greeting
  if (/^(hi|hello|hey|yo|good\s?(morning|afternoon|evening))\b/.test(text)) {
    return {
      text: "Hi there! I'm Little George, your KamGeorge shopping assistant.\nAsk me about products, prices, delivery, payments, returns or tracking your order!",
    };
  }

  // Thanks
  if (has("thank", "thx", "appreciated")) {
    return { text: "You're welcome! Anything else I can help you with?" };
  }

  // Goodbye
  if (/\b(bye|goodbye|see you|goodnight|good night)\b/.test(text)) {
    return {
      text: "Goodbye! Thanks for shopping with KamGeorge — come back soon!",
    };
  }

  // Help
  if (has("help", "what can you do", "options", "menu")) {
    return {
      text: "I can help you with:\n• Finding products & prices\n• Delivery & payment info\n• Returns & refunds\n• Tracking your orders\n• Creating an account\n\nJust ask away!",
    };
  }

  // Fallback
  return {
    text: "Hmm, I'm not sure about that.\nI answer questions about products, delivery, payments, returns and orders — try one of the suggestions below!",
  };
}
