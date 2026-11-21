# NC Elektric Construction & Trading Co. — React Catalog

Production-oriented B2B electrical products catalog with quotation requests, Supabase-backed CMS, and full-width responsive public pages. **No cart/checkout. No Framer.**

## Design implementation kit

Assets from `NC_Elektric_Design_Implementation_Kit/` are copied into `public/assets/` (brand, banners, category SVGs). Visual references:

- `NC_Elektric_Design_Implementation_Kit/design-references/01-approved-homepage.png`
- `NC_Elektric_Design_Implementation_Kit/design-references/02-approved-collection.png`
- `NC_Elektric_Design_Implementation_Kit/design-references/03-approved-product-detail.png`

Original product **photographs** remain the six PNG files in `public/assets/image(20261120-*.png)`. Map each to verified SKUs in admin.

Run migration `003_design_categories.sql` after `002` to align category art with the kit.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4
- React Router 7
- Supabase (PostgreSQL, Auth, Storage, RLS, Edge Functions)
- Lucide React icons

## Local development

1. Install **Node.js 20.19+ or 22+**.
2. `npm install`
3. `npm run dev` → open `http://localhost:5173`
4. Without Supabase, the site uses **draft catalog data** in `src/data/defaults.ts` and local images in `public/assets/`.

## Supabase setup

1. Create a Supabase project.
2. Run migrations in order in the SQL Editor:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_content_and_quotes.sql`
   - `supabase/migrations/003_design_categories.sql`
3. Copy `.env.example` → `.env.local` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (canonical URL for SEO; optional locally)
4. Create an Auth user (email/password), then grant admin:

```sql
insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
```

5. Sign in at `/admin`.

## Quotation email (Edge Function)

1. Deploy: `supabase functions deploy submit-quote`
2. Set secrets: `SITE_ORIGIN`, `RESEND_API_KEY`, `OWNER_QUOTE_EMAIL`, `EMAIL_FROM`
3. Verify a sending domain in Resend.
4. Test submission end-to-end; the modal reports whether email delivery was configured.

Rate limiting: 8 submissions per IP per 15 minutes (see `quote_rate_limits` table).

## Project structure

- `src/App.tsx` — routes and layout
- `src/pages/` — public pages + `admin/` CMS
- `src/components/` — Header, Footer, ProductCard, QuoteModal, PageMeta
- `src/hooks/` — Supabase data loaders with offline fallbacks
- `src/data/defaults.ts` — draft products, categories, and site copy

## Public routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/products` | Product catalog (search + filters) |
| `/collections` | Category hub |
| `/products/:slug` | Product detail |
| `/about`, `/contact` | Company pages (CMS-editable) |
| `/admin` | CMS (auth required) |

## Build & deploy

```bash
npm run build
npm run preview
```

**Vercel:** import repo, framework preset Vite, build command `npm run build`, output directory `dist`. Add the same `VITE_*` env vars.

Update `public/sitemap.xml` canonical URLs (or regenerate) when `VITE_SITE_URL` changes for production.

## Test results (local)

- `npm run build` — **passed** (TypeScript `--noEmit` + Vite production build)

## Before public launch

- Replace draft product copy and images with owner-verified catalog entries.
- Complete `002` migration and configure quotation email.
- Set production `VITE_SITE_URL` and sitemap URLs.
- Review RLS, admin access, and accessibility in target browsers.