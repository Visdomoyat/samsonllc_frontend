# Eliteforge Peptide — Frontend

Customer-facing React storefront for **Eliteforge Peptide**. Connects to the Django API for products, orders, and payments (Stripe + PayPal).

**Client-facing guide (plain language):** [CLIENT_GUIDE.md](./CLIENT_GUIDE.md)

## Overview

| Layer | Technology |
|-------|------------|
| Framework | React Router 7 (SSR) |
| Styling | Tailwind CSS v4 |
| Cart | React Context + `localStorage` |
| Frontend hosting | Netlify |
| Backend API | Django on Render |

This is a **public read-only shop** — no customer login. Product and order management stays on the Django backend.

---

## Pages & routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Hero, highlights, featured products |
| `/shop` | Shop | Full catalog; search via `?q=...` |
| `/contact` | Contact | Contact form (UI only) |
| `/checkout` | Checkout | Shipping form → order → payment |
| `/checkout/success` | Success | Payment confirmation + order summary |
| `/checkout/cancel` | Cancel | Payment cancelled message |

Every page includes the **NavBar** and **Cart drawer** (from `app/root.tsx`).

---

## Customer journey

```
Home / Shop
    ↓ Add to cart
Cart drawer (right sidebar)
    ↓ Checkout
Checkout form (name, email, shipping)
    ↓ Continue to payment
POST /api/orders/  →  order ID saved
    ↓
Pay with card (Stripe)  OR  Pay with PayPal
    ↓ redirect
/checkout/success  or  /checkout/cancel
```

### Cart

- Opens from the **cart icon** (top right) — not a separate page
- Stored in `localStorage` under key `eliteforge-cart`
- Shows name, description, price, and quantity controls
- Persists across page refreshes

### Checkout & payments

- Order is created on the backend first; payment uses that **order ID**
- **Stripe:** redirects to Stripe Hosted Checkout (`checkout_url`)
- **PayPal:** redirects to PayPal approval page (`approval_url`)
- No PayPal/Stripe script tags on the frontend — redirect-only flow

---

## Project structure

```
app/
├── root.tsx              # Layout: NavBar + CartDrawer + pages
├── routes.ts             # URL → route file mapping
├── app.css               # Theme colors + hero animation
├── components/
│   ├── NavBar.tsx
│   ├── Landing.tsx       # Home page content
│   ├── CartDrawer.tsx
│   ├── CheckoutPayment.tsx
│   └── Spinner.tsx
├── context/
│   └── CartContext.tsx   # Cart state + localStorage
├── lib/
│   ├── env.ts            # API base URL logic
│   ├── api.ts            # Products API
│   └── checkout.ts       # Orders + payments API
├── routes/
│   ├── home.tsx
│   ├── shop.tsx
│   ├── contact.tsx
│   ├── checkout.tsx
│   ├── checkout.success.tsx
│   └── checkout.cancel.tsx
└── assets/image/
    ├── logo.jpeg
    └── landing.png
```

---

## Backend API

**Base URL:** `https://eliteforge-jkaf.onrender.com/api`

| Endpoint | Purpose |
|----------|---------|
| `GET /api/products/` | Shop & featured products |
| `POST /api/orders/` | Create order at checkout |
| `GET /api/config/payments/` | Stripe/PayPal button visibility |
| `POST /api/orders/{id}/pay/stripe/` | Stripe redirect URL |
| `POST /api/orders/{id}/pay/paypal/` | PayPal redirect URL |
| `GET /api/orders/{id}/` | Order status on success page |
| `POST /api/orders/{id}/paypal/capture/` | PayPal capture after return |

> **Note:** `https://eliteforge-jkaf.onrender.com/shop/` is the Django **admin** shop (login required), not this React storefront.

---

## Environment variables

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=https://eliteforge-jkaf.onrender.com/api
API_URL=https://eliteforge-jkaf.onrender.com/api
```

| Variable | Used when |
|----------|-----------|
| `VITE_API_BASE_URL` | Browser in production builds |
| `API_URL` | SSR loaders on the server (Netlify) |

**Local dev:** the browser uses `/api`, which Vite proxies to `http://127.0.0.1:8000`. Run Django locally on port 8000 for local API calls.

---

## Local development

```bash
# Terminal 1 — backend (Samsonllc_backend)
pipenv run python manage.py runserver

# Terminal 2 — frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
npm run typecheck   # TypeScript check
npm run build       # Production build
npm run start       # Run production build locally
```

---

## Deployment

### Frontend → Netlify

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `build/client` |

**Netlify environment variables:**

```
VITE_API_BASE_URL=https://eliteforge-jkaf.onrender.com/api
API_URL=https://eliteforge-jkaf.onrender.com/api
```

Redeploy after changing any `VITE_*` variable (values are baked in at build time).

Netlify config lives in `netlofy.toml` (build/publish settings).

### Backend → Render

On the Django service, set:

```
FRONTEND_URL=https://your-netlify-site.netlify.app
```

Ensure Django `FRONTEND_ORIGINS` includes your Netlify URL for CORS.

---

## Branding & customization

### Colors (`app/app.css`)

- Surface: `#f9f9f9`
- Brand navy: `#001b44`

### NavBar (`app/components/NavBar.tsx`)

- Logo left, Home / Shop / Contact + search center, cart icon right
- Search navigates to `/shop?q=...`

### Landing hero (`app/components/Landing.tsx`)

- Hero image: `app/assets/image/landing.png`
- **Image size:** edit the `<img>` `className` (~line 120) — adjust `max-w-*` and `scale-*`
- **Float animation:** `app/app.css` → `@keyframes hero-float`
- Bottom CTA: vial images on left and right edges of the navy banner

### Quick reference

| Change | File |
|--------|------|
| Home content | `app/components/Landing.tsx` |
| Product grid | `app/routes/shop.tsx` |
| Navigation | `app/components/NavBar.tsx` |
| Cart | `app/context/CartContext.tsx`, `app/components/CartDrawer.tsx` |
| Checkout form | `app/routes/checkout.tsx` |
| Payment buttons | `app/components/CheckoutPayment.tsx` |
| New page | Add route in `app/routes/` + `app/routes.ts` |

---

## Architecture

```
┌─────────────────────────────────────┐
│  Netlify (React frontend)           │
│  - Pages, cart, checkout UI         │
└──────────────┬──────────────────────┘
               │ HTTPS /api/*
               ▼
┌─────────────────────────────────────┐
│  Render (Django backend)            │
│  - Products, orders, Stripe, PayPal │
└──────────────┬──────────────────────┘
               ▼
         PostgreSQL + media files
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Shop empty on Netlify | Wrong API URL or empty Render DB | Check Netlify env vars; add products on Render |
| Can't create order | CORS or API down | Check Network tab in DevTools; verify Render is running |
| PayPal/Stripe buttons missing | Backend payment keys not set | Configure Stripe/PayPal env vars on Render |
| Works locally, not in production | Missing `VITE_API_BASE_URL` on Netlify | Add env vars and redeploy |
| Cart empty at checkout | Order already created, or cart not hydrated | Add items again; wait for checkout page to load |
