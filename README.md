# KamGeorge 🛍️

An e-commerce storefront built with **Next.js 14** (App Router) — deployed on **Vercel**.

## Features

- Product catalog with search, category filters & sorting
- Product detail pages (statically generated)
- Cart with quantity controls, persisted to `localStorage`
- Checkout flow with delivery form & order confirmation
- Prices in Ghana Cedis (GH₵), Mobile Money friendly messaging
- Fully responsive, no CSS framework required

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & deploy

```bash
npm run build
npm start
```

Push to `main` and Vercel will build & deploy automatically (framework preset: **Next.js**).

## Store manager (login required)

- Public visitors only ever see the storefront (shop, cart, checkout).
  There are no "manage store" links anywhere in the public UI, and visiting
  `/admin` while logged out shows a restricted-area notice — never the
  management interface.
- Managers log in at `/login` with the demo credentials:
  - email: `admin@kamgeorge.com`
  - password: `admin123`
- After login, a **Manage store** link appears in the navbar, opening the
  `/admin` dashboard: add / edit / delete products, reset the catalog.
- Note: this demo keeps the session and catalog overrides in the browser's
  `localStorage`, so manager edits apply to that browser. For multi-user
  sync you would connect a database (e.g. Vercel Postgres) with server-side
  auth.

## Project structure

```
app/                 # Routes: home, cart, checkout, products/[id], login, admin
components/          # Navbar, ProductCard/Grid/Detail, Cart, Checkout,
                     # AuthContext, ProductsContext, LoginForm, AdminDashboard
lib/products.js      # Default product catalog data
```
