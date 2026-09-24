# KamGeorge

An e-commerce storefront built with **Next.js 14** (App Router) — deployed on **Vercel**.

## Features

- **Heavy sticky header** — announcement strip (delivery + MoMo message),
  brand block, product search, account/cart actions with live cart count,
  a Checkout button and a category navigation row. The top strip collapses
  smoothly as you scroll, and everything stacks into a mobile drawer.
- Product catalog with search, category filters & sorting
- Header search & category links deep-link the grid (`/?q=…`, `/?c=…#products`)
- Product detail pages (statically generated)
- Cart with quantity controls, persisted to `localStorage`
- Customer accounts: modern register/login, My account with purchase history
- Little George — built-in chat assistant answering product, delivery, payment & order questions
- Custom backgrounds: white, black, blue, red, pink, green and gray themes
- Account required: customers must log in or register before placing an order
- Checkout flow with delivery form & order confirmation
- Login-gated manager dashboard, linked only from the footer
- Manager can edit the footer **Support** lines and change the manager
  **login email & password** from the dashboard (Site settings)
- Prices in Ghana Cedis (GH₵), Mobile Money friendly messaging
- Fully responsive, no CSS framework required

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo manager login: `admin@kamgeorge.com` / `admin123` (via the Store manager link in the footer). The manager can change this email and password from the dashboard after logging in.

## Build & deploy

```bash
npm run build
npm start
```

Push to `main` and Vercel will build & deploy automatically (framework preset: **Next.js**).

## Customer accounts

- Shoppers **create an account** at `/register` (name, email, optional
  mobile number, password) and log in at `/login` — an account is required
  before an order can be placed. Their details are prefilled at checkout, and
  every order is saved to **My purchases** on their account page — with
  items, totals and a live status (Processing → In transit → Delivered).
- Customer accounts are stored in the browser's `localStorage` in this demo
  (passwords are not hashed — do not use real passwords). A production app
  would use a database with hashed passwords and server-side sessions.
- **Email verification**: signup, login and password reset (`/forgot-password`)
  all require a 6-digit code sent to the customer's email (5-minute expiry,
  5 attempts, 30s resend wait). This demo shows the code on screen instead
  of sending a real email — see `lib/otp.js`. To go live, plug an email
  provider (e.g. Resend or SendGrid) into `requestEmailCode` via a server
  route + Vercel env vars.

## Store manager (login required, link at the very bottom)

- Public visitors only ever see the storefront. The only manager entry point
  is a small **Store manager** link in the footer, at the very bottom of
  every page.
- Managers log in at `/admin/login` with the demo credentials:
  - email: `admin@kamgeorge.com`
  - password: `admin123`
- After login, `/admin` opens the dashboard: add / edit / delete products
  (with photo upload or image URL), reset the catalog. Visiting `/admin`
  without a manager session shows a
  restricted-area notice — never the management interface.
- **Site settings** (bottom of the dashboard):
  - *Footer · Support section* — edit the Support lines shown on every page
    (delivery, Mobile Money, returns, contact email…). Add or remove lines;
    email addresses become clickable `mailto:` links. "Reset to defaults"
    restores the original four lines.
  - *Manager login* — change the manager email and/or password (current
    password required). The demo-credentials hint on the login page
    disappears once the defaults are changed. The active session stays
    signed in after a change.
- Note: this demo keeps the session, catalog overrides, site settings and
  manager credentials in the browser's
  `localStorage`, so manager edits apply to that browser. For multi-user
  sync you would connect a database (e.g. Vercel Postgres) with server-side
  auth.

## Real email delivery

Out of the box the shop runs in **demo mode**: verification codes appear on
screen instead of being emailed. To send real emails via
[Resend](https://resend.com) (free tier: 100 emails/day):

1. Sign up at resend.com and create an **API key** (it starts with `re_`).
   Copy it — you won't see it again.
2. Pick a sender address:
   - **Testing**: use `onboarding@resend.dev` — works immediately, but
     delivers to your own account email only.
   - **Real customers**: verify your domain (Resend → Domains → Add domain →
     add the DNS records at your registrar), then use an address on it,
     e.g. `hello@kamgeorge.com`.
3. Tell the app about it:
   - Locally: copy `.env.example` to `.env.local` and fill in
     `RESEND_API_KEY` and `EMAIL_FROM`, then restart the server.
   - On Vercel: Project → Settings → Environment Variables → add
     `RESEND_API_KEY` and `EMAIL_FROM` → redeploy.
4. Register/log in with a real email — the code now arrives by email (check
   spam if it doesn't appear). If sending ever fails, the shop falls back to
   the demo on-screen code so testing never breaks.

## Paystack payments

Checkout initializes a Paystack transaction (GHS, amount in pesewas) and
redirects the customer to Paystack. After payment they return to
`/checkout/callback`, which verifies the reference server-side before the
order is saved.

1. Create a Paystack account and copy the **secret key** from
   Settings → API Keys & Webhooks.
2. Locally: add `PAYSTACK_SECRET_KEY=sk_test_…` to `.env.local`.
   On Vercel: Project → Settings → Environment Variables → add
   `PAYSTACK_SECRET_KEY` (and optionally `NEXT_PUBLIC_SITE_URL` as your
   live origin).
3. Redeploy. Use Paystack test cards / MoMo in test mode.

## Project structure

```
app/                 # Routes: home, cart, checkout, products/[id],
                     # login, register, account, admin, admin/login
components/          # Navbar, Footer, ChatWidget, icons, ProductCard/Grid/Detail,
                     # Cart, Checkout, Auth/Products contexts, Login/Register/
                     # Account forms, ManagerLoginForm, AdminDashboard
lib/                 # products.js (catalog), orders.js, assistant.js (chat brain)
```
