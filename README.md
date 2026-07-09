# 1989 — Digital Menu System

A production-ready, offline-first digital menu for **1989**, an Iraqi breakfast & snacks restaurant. "Baghdad meets Berlin" — deep charcoal backgrounds, gold/amber accents, bilingual Arabic/English with full RTL support.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

Build for production:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or your own server).

## Admin access

Go to `/admin` and sign in with:

- **Username:** `admin`
- **Password:** `1989admin`

Change these in `src/store/auth.ts` (`DEMO_USER` / `DEMO_PASS`) before going live. This is a client-side offline-first prototype — for a real production deployment with multiple staff accounts, wire this up to a real auth backend.

## What's inside

### Customer menu (`/`)
- Animated hero with the "1989" wordmark, floating particles, tea-toned gradient
- Live search with auto-suggest (name + ingredients)
- Sticky category tabs (فطور صباحي / سناك & بركر) that track scroll position
- Food cards (16:9 image, bilingual name & description, price in د.ع, ratings, "Chef's Pick" badge)
- Slide-in cart drawer with quantity controls, running total, and a "Call waiter" action
- Floating cart button with live item-count badge
- Footer with address, phone/WhatsApp, social links, and hours — all editable from the admin
- Full Arabic/English toggle with RTL layout mirroring

### Admin dashboard (`/admin`)
- **Dashboard** — stat cards (items, categories, today's views, featured count) + most-viewed list
- **Categories** — add / edit / delete, drag-to-reorder, show/hide toggle
- **Items** — searchable/filterable grid, add/edit modal (bilingual fields, tag-based ingredient input, auto-cropped image upload, availability & featured toggles), bulk select → delete or move to another category
- **Restaurant Settings** — logo (circular auto-crop), name, about (AR/EN), SEO description, address + Google Maps embed, multiple phone numbers with WhatsApp flag, social links, day-by-day working hours, plus **JSON backup export/import**
- **Theme** — primary color picker (presets + custom), default dark/light mode, font-size scale
- **QR Generator** — enter a table number, generate and download a scannable PNG that deep-links to the menu

### Data & architecture
- React 19 + TypeScript + Vite
- Tailwind CSS with a custom "1989" design-token theme (`tailwind.config.js`)
- Framer Motion for page/section/hover/modal animations
- Zustand for cart, auth, and language state (persisted to localStorage)
- React Hook Form + Zod for all admin forms
- **Dexie.js (IndexedDB)** for fully offline-first data storage — the menu works with no backend and no network after first load
- React Router v6 with a protected `/admin/*` route group

Data model matches the required schema exactly (`src/types/index.ts`): `Category`, `MenuItem`, `Restaurant`.

## Notes on scope

- **Image "crop"** is implemented as an automatic center-crop to the correct aspect ratio (16:9 for dishes, 1:1 circular for the logo) at upload time — not a manual drag-to-crop UI. This keeps uploads fast and foolproof; swap in a library like `react-easy-crop` if you want manual control later.
- **Reviews/ratings** are seeded as static per-item averages; there's no customer-facing "submit a rating" flow yet.
- **Analytics** (view counts) are tracked in the schema and surfaced on the dashboard, but the customer menu doesn't yet fire view events on scroll — hook that up in `MenuPage.tsx` if you want live tracking.
- All images in the seed data are hotlinked from Unsplash for demo purposes — replace them via the admin's image upload (which stores images as data URLs directly in IndexedDB, so your own photos work offline immediately).

## Fonts

Cairo (Arabic display) + Tajawal (Arabic body) + Fraunces (English display) + Inter (English body/UI), loaded from Google Fonts in `src/index.css`.
