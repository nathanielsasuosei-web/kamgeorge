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

## Project structure

```
app/            # Routes: home, cart, checkout, products/[id]
components/     # Navbar, ProductCard/Grid, Cart, Checkout, …
lib/products.js # Product catalog data
```
