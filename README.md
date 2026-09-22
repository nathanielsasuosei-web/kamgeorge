# KamGeorge

An e-commerce storefront built with **Next.js 14** (App Router) — deployed on **Vercel**.

## Features

- Product catalog with search, category filters & sorting
- Product detail pages (statically generated)
- Cart with quantity controls, persisted to `localStorage`
- Customer accounts: modern register/login, My account with purchase history
- Little George — built-in chat assistant answering product, delivery, payment & order questions
- Custom backgrounds: white, black, blue, red, pink, green and gray themes
- Account required: customers must log in or register before placing an order
- Checkout flow with delivery form & order confirmation
- Login-gated manager dashboard, linked only from the footer
- Prices in Ghana Cedis (GH₵), Mobile Money friendly messaging
- Fully responsive, no CSS framework required

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo manager login: `admin@kamgeorge.com` / `admin123` (via the Store manager link in the footer).

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
- Note: this demo keeps the session and catalog overrides in the browser's
  `localStorage`, so manager edits apply to that browser. For multi-user
  sync you would connect a database (e.g. Vercel Postgres) with server-side
  auth.

## Project structure

```
app/                 # Routes: home, cart, checkout, products/[id],
                     # login, register, account, admin, admin/login
components/          # Navbar, Footer, ChatWidget, icons, ProductCard/Grid/Detail,
                     # Cart, Checkout, Auth/Products contexts, Login/Register/
                     # Account forms, ManagerLoginForm, AdminDashboard
lib/                 # products.js (catalog), orders.js, assistant.js (chat brain)
```
