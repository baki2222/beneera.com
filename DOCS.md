# Tech Aabid — Project Documentation

**Last updated:** March 11, 2026

> A complete ecommerce pet store built with Next.js, featuring a customer-facing storefront and a full admin panel.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Storefront Pages](#storefront-pages)
- [Admin Panel](#admin-panel)
- [Data Architecture](#data-architecture)
- [Components](#components)
- [Configuration](#configuration)
- [SEO](#seo)
- [Deployment](#deployment)
- [Future Integration Notes](#future-integration-notes)
- [Changelog](#changelog)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | App Router, SSR, routing |
| React | 19.2.3 | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | 4.x | Pre-built UI components |
| Lucide React | 0.577 | Icon library |
| Vercel | — | Hosting & deployment |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/baki2222/techaabid.com.git
cd techaabid.com

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

### Environment

No environment variables needed for the current mock-data setup. When integrating a real backend, add a `.env.local` with:

```env
DATABASE_URL=...          # PostgreSQL / Supabase
NEXT_PUBLIC_STRIPE_KEY=...
STRIPE_SECRET_KEY=...
CLOUDINARY_URL=...        # Image hosting
RESEND_API_KEY=...        # Email notifications
```

---

## Project Structure

```
techaabid.com/
├── public/
│   ├── images/
│   │   ├── products/       # Product images (locally hosted)
│   │   └── categories/     # Category banner images
│   ├── og-image.png         # Social share image
│   └── icon.svg             # Favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout (fonts, meta, StorefrontShell)
│   │   ├── globals.css      # Global styles
│   │   ├── page.tsx         # Homepage
│   │   ├── shop/            # Shop listing
│   │   ├── shop/[category]/ # Category filtered shop
│   │   ├── product/[slug]/  # Product detail page
│   │   ├── cart/            # Cart page
│   │   ├── checkout/        # Checkout page
│   │   ├── wishlist/        # Wishlist page
│   │   ├── search/          # Search page
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── faq/             # FAQ page
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   ├── track-order/     # Track Order page
│   │   ├── policies/        # 7 policy pages
│   │   └── admin/           # Admin panel (15 sections)
│   ├── components/
│   │   ├── layout/          # Header, Footer, AnnouncementBar, CartDrawer, StorefrontShell
│   │   ├── ui/              # shadcn base components
│   │   ├── admin/           # Admin-specific components
│   │   ├── home/            # Homepage sections
│   │   ├── product/         # Product card, gallery, details
│   │   └── forms/           # NewsletterForm, ContactForm
│   ├── data/
│   │   ├── products.ts      # All 100 products aggregated
│   │   ├── products-*.ts    # 10 category-specific product files
│   │   ├── categories.ts    # 10 categories
│   │   ├── faqs.ts          # FAQ data
│   │   ├── site-config.ts   # Store config (name, contact, nav)
│   │   └── admin/           # Mock admin data (orders, customers, etc.)
│   └── lib/
│       ├── types.ts           # Product, Category, FAQ, SiteConfig, CartItem
│       ├── admin-types.ts     # Order, Customer, Inquiry, Coupon, AdminUser, etc.
│       ├── cart-context.tsx    # Cart state (React Context)
│       ├── wishlist-context.tsx # Wishlist state (React Context)
│       ├── admin-auth-context.tsx # Admin auth (login, session, protection)
│       └── utils.ts           # Utility functions (cn)
└── DOCS.md                    # ← This file
```

---

## Storefront Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero carousel, categories, featured products, newsletter |
| `/shop` | Full product catalog with grid layout |
| `/shop/[category]` | Category-filtered product listing |
| `/product/[slug]` | Product detail with gallery, specs, reviews, SEO |
| `/cart` | Shopping cart with qty controls |
| `/checkout` | Checkout form |
| `/wishlist` | Saved items |
| `/search` | Product search |
| `/about` | About the store |
| `/contact` | Contact form |
| `/faq` | Frequently asked questions |
| `/login` | Customer login |
| `/register` | Customer registration |
| `/track-order` | Order tracking |
| `/policies/*` | Shipping, Returns, Privacy, Terms, Disclaimer, Cookies, Accessibility |

### Products

- **100 products** across 10 categories
- Each product has: title, subtitle, SKU, price, compare-at price, images, badges, features, specifications, SEO fields
- Product images hosted locally in `public/images/products/`

### Categories

| # | Category | Slug | Products |
|---|----------|------|----------|
| 1 | Dog Food & Treats | `dog-food-treats` | 10 |
| 2 | Cat Supplies | `cat-supplies` | 10 |
| 3 | Pet Toys | `pet-toys` | 10 |
| 4 | Pet Beds & Furniture | `pet-beds-furniture` | 10 |
| 5 | Pet Grooming | `pet-grooming` | 10 |
| 6 | Pet Health & Wellness | `pet-health-wellness` | 10 |
| 7 | Collars, Leashes & Harnesses | `collars-leashes-harnesses` | 10 |
| 8 | Pet Travel & Outdoor | `pet-travel-outdoor` | 10 |
| 9 | Pet Feeders & Bowls | `pet-feeders-bowls` | 10 |
| 10 | Aquarium & Fish Supplies | `aquarium-fish-supplies` | 10 |

---

## Admin Panel

**URL:** `/admin/login`
**Credentials:** `admin@techaabid.com` / `admin123`

### Features

| Section | Route | Description |
|---------|-------|-------------|
| Dashboard | `/admin` | Stats, recent orders, low stock, inquiries, quick actions |
| Products | `/admin/products` | CRUD, search, filter, sort, pagination, bulk select |
| Product Form | `/admin/products/new` or `/admin/products/[id]` | 6-tab form (Basic, Media, Pricing, Description, Specs, SEO) |
| Categories | `/admin/categories` | CRUD with modal, image, SEO fields |
| Orders | `/admin/orders` | List with status tabs, search |
| Order Detail | `/admin/orders/[id]` | Items, totals, status update, notes |
| Customers | `/admin/customers` | List with search, order count, total spent |
| Customer Detail | `/admin/customers/[id]` | Order history, address, tags, notes |
| Inquiries | `/admin/inquiries` | Status tabs (New/Open/Replied/Closed), detail dialog |
| Coupons | `/admin/coupons` | CRUD with code, type, amount, expiry, usage |
| Content | `/admin/content` | Hero, promo, newsletter, footer editors |
| Pages | `/admin/pages` | Editable pages with SEO fields |
| Media | `/admin/media` | Grid/list view, alt text, URL copy |
| Analytics | `/admin/analytics` | Revenue chart, top products, categories, activity feed |
| Users | `/admin/users` | Role management (Owner/Admin/Staff) |
| Settings | `/admin/settings` | General, Commerce, Social, SEO, Notifications |

### Auth

- Mock authentication via `admin-auth-context.tsx`
- Session stored in `localStorage`
- Route protection: unauthenticated users redirected to `/admin/login`
- Login page is excluded from the admin layout shell

### Admin Layout

- **Sidebar:** Dark zinc-950, grouped navigation with icons, collapsible on mobile
- **Topbar:** Notification bell, user avatar dropdown with sign-out
- **StorefrontShell:** `components/layout/StorefrontShell.tsx` hides storefront header/footer on `/admin` routes

---

## Data Architecture

All data lives in `src/data/` as static TypeScript files. This is designed for easy swap to a real database.

### Storefront Data

| File | Content |
|------|---------|
| `products.ts` | Aggregates all 100 products from 10 category files |
| `products-dog-food.ts` | 10 dog food products |
| `products-cat-supplies.ts` | 10 cat supply products |
| `products-pet-toys.ts` | 10 pet toy products |
| `products-pet-beds.ts` | 10 pet bed products |
| `products-pet-grooming.ts` | 10 grooming products |
| `products-pet-health.ts` | 10 health products |
| `products-collars-leashes.ts` | 10 collar/leash products |
| `products-pet-travel.ts` | 10 travel products |
| `products-feeders-bowls.ts` | 10 feeder products |
| `products-aquarium.ts` | 10 aquarium products |
| `categories.ts` | 10 categories with slugs, images |
| `faqs.ts` | FAQ data |
| `site-config.ts` | Store name, email, phone, address, navigation, footer links |

### Admin Data (`src/data/admin/`)

| File | Content |
|------|---------|
| `orders.ts` | 15 mock orders with items, addresses, statuses |
| `customers.ts` | 15 mock customers with order history, tags |
| `inquiries.ts` | 12 mock inquiries (contact, product, support, wholesale) |
| `coupons.ts` | 8 mock discount codes |
| `users.ts` | 3 staff users + `validateLogin()` function |
| `pages.ts` | 10 editable pages |

### Types (`src/lib/`)

| File | Interfaces |
|------|-----------|
| `types.ts` | `Product`, `Category`, `FAQ`, `SiteConfig`, `NavItem`, `CartItem` |
| `admin-types.ts` | `Order`, `OrderItem`, `Address`, `Customer`, `Inquiry`, `Coupon`, `AdminUser`, `ContentBlock`, `AdminPage`, `MediaItem`, `AnalyticsData`, `AdminSession` |

---

## Components

### Layout Components (`components/layout/`)

| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Storefront nav with categories dropdown, search, cart, wishlist |
| `Footer.tsx` | Links, newsletter, copyright |
| `AnnouncementBar.tsx` | Free shipping banner |
| `CartDrawer.tsx` | Slide-out cart panel |
| `StorefrontShell.tsx` | Conditionally hides storefront UI on admin routes |

### Admin Components (`components/admin/`)

| Component | Purpose |
|-----------|---------|
| `AdminSidebar.tsx` | Navigation with grouped sections, mobile sheet |
| `AdminTopbar.tsx` | Search, notifications, user dropdown |
| `StatCard.tsx` | Metric card with icon, value, trend |
| `StatusBadge.tsx` | Color-coded status pill (30+ status variants) |
| `ConfirmDialog.tsx` | Delete/deactivate confirmation modal |
| `EmptyState.tsx` | Empty list placeholder with icon and action |

### UI Components (`components/ui/`)

shadcn/ui base components: `button`, `dialog`, `input`, `label`, `select`, `tabs`, `textarea`, `checkbox`, `badge`, `accordion`, `separator`, `sheet`

---

## Configuration

### Store Settings

Edit `src/data/site-config.ts` to change:

- Store name & tagline
- Support email & phone
- Business address
- Business hours
- Social media links
- Navigation items
- Footer links

### Contact Email

Currently: `support@techaabid.com`

### Phone

Currently: `+1 (302) 266-1513`

---

## SEO

### Per-Page SEO

- **Product pages:** `generateMetadata` with product-specific title, description, OpenGraph image, Twitter card, canonical URL, JSON-LD (Product schema with brand, rating, offers)
- **Category pages:** `generateMetadata` with category-specific title and description
- **Root layout:** Default title template `%s | Tech Aabid`, OpenGraph defaults

### OpenGraph

- Default OG image: `/og-image.png` (1200×630)
- Product pages use the product's first image
- Twitter card: `summary_large_image`

### JSON-LD

- Organization schema on all pages (root layout)
- Product schema with `AggregateRating`, `Offer`, and `Brand` on product pages

---

## Deployment

### Vercel (Current)

1. Push to `main` branch on GitHub
2. Vercel auto-deploys from `github.com/baki2222/techaabid.com`
3. Domain: `techaabid.com` / `www.techaabid.com`

### Git Config

```
user.name: baki2222
user.email: bbillah6@gmail.com
```

### Manual Deploy

```bash
npm run build    # Production build
npm start        # Start production server
```

---

## Future Integration Notes

The project is structured for easy integration with:

| Service | Integration Point |
|---------|------------------|
| **Supabase / PostgreSQL** | Replace `src/data/` files with DB queries via Prisma |
| **Prisma** | Add `prisma/schema.prisma`, generate client, swap data layer |
| **Stripe** | Payment processing, order sync (checkout + admin orders) |
| **Cloudinary / S3** | Replace local images in `public/images/` with CDN URLs |
| **Resend / SendGrid** | Order confirmations, admin alerts (settings > notifications) |
| **NextAuth / Supabase Auth** | Replace `admin-auth-context.tsx` mock with real auth |

### Steps to connect a real database:

1. Install Prisma: `npm install prisma @prisma/client`
2. Create schema matching the types in `src/lib/types.ts` and `src/lib/admin-types.ts`
3. Replace static imports from `src/data/` with Prisma queries
4. Admin CRUD operations → Server Actions or API routes

---

## Changelog

### March 11, 2026

**Admin Panel** — Complete store-owner dashboard
- 36 new files, 22 admin routes, 15 management sections
- Login/auth with route protection
- Dashboard, Products CRUD, Categories, Orders, Customers, Inquiries, Coupons
- Content editor, Pages editor, Media library, Analytics, Users, Settings
- Admin layout isolation (StorefrontShell hides storefront on admin routes)

### March 9, 2026

**SEO & Meta Fixes**
- Product & category pages: `generateMetadata` with title, description, OpenGraph, Twitter, canonical, JSON-LD
- Fixed duplicate title suffix (`| Tech Aabid | Tech Aabid`)
- Added default OG image for social sharing
- Fixed Vercel deployment (git author verification)

**Contact Updates**
- Email: `contac@techaabid.com` → `support@techaabid.com` (11 files)
- Phone: `+1 302 266 1513` → `+1 (302) 266-1513`

### March 8, 2026

**Mobile Fixes**
- Newsletter subscribe button: stacks vertically on mobile
- Footer logo: stacks vertically with copyright on mobile
- Product page: overflow protection on all elements

**Product Images**
- Generated realistic product images for all 100 products
- Hosted locally in `public/images/products/`
