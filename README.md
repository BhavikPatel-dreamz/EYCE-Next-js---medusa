# EYCE — Silicone-First Smoking Gear Storefront

A production-ready **frontend-only** eCommerce storefront built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn-style UI, Framer Motion, Zustand, React Hook Form + Zod, and Swiper.

Designed to be plugged into a **Medusa** backend later without changing the UI layer — all data access goes through `src/lib/api.ts`, which currently returns local dummy data from `src/data/`. Swap those functions for Medusa SDK calls when you're ready.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack

- Next.js 16 · App Router · Server Components by default
- React 19 · TypeScript strict
- Tailwind CSS v4 (CSS-first, `@theme` in `globals.css`)
- Framer Motion, Lucide, Swiper
- Zustand (cart + wishlist, persisted to localStorage)
- React Hook Form + Zod (checkout)
- next/image, next/font (Inter)

## Structure

```
src/
  app/                  App Router routes + nested layouts
    (shop)/
      shop/             Catalog
      product/[slug]/   PDP
      cart/
      checkout/
  components/
    ui/                 Button, Input, Badge, etc.
    layout/             Navbar, Footer, Announcement bar
    home/               Hero, FeaturedGrid, Categories, Testimonials
    product/            ProductCard, Gallery, VariantPicker
    cart/               CartDrawer, CartLine
  data/                 products.ts, categories.ts, testimonials.ts
  lib/                  api.ts (mock), utils.ts, format.ts
  store/                cart-store.ts, wishlist-store.ts
  types/                product.ts, cart.ts
```

## Connecting to Medusa later

Replace the bodies of `getProducts`, `getProductBySlug`, `getCategories` in `src/lib/api.ts` with Medusa SDK calls. The UI won't change.
