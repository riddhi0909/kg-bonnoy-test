# Headless WooCommerce storefront (Next.js + Apollo + WPGraphQL)

Production-oriented **JavaScript** (no TypeScript) App Router frontend. Each feature lives in **`src/modules/{name}`** with the same folder layout so the codebase stays predictable.

## Stack

- **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**
- **Apollo Client 4** + **`@apollo/client-integration-nextjs`** (RSC + streaming SSR)
- **WordPress** + **WPGraphQL** + **WooCommerce** (WPGraphQL for WooCommerce plugin on the CMS side)

## Global layout

```text
src/
├── app/                 # Routes only — keep thin; call modules from here
├── modules/             # product, cart, auth, … (see below)
├── apollo/              # Client factory + provider + register-client (RSC)
├── config/              # env helpers, i18n locales, currency config
├── constants/           # Cross-module route builders
├── lib/                 # Cross-cutting helpers (e.g. SEO)
├── styles/              # (optional) add shared CSS beside globals.css
└── middleware.js        # Locale prefix + NEXT_LOCALE cookie
```

## Module contract (strict)

Every module under `src/modules/<name>/` follows:

```text
modules/<name>/
├── api/           # GraphQL: queries.js, mutations.js, fragments.js
├── components/    # UI (.jsx)
├── hooks/         # Client hooks ("use client" when needed)
├── services/      # Calls Apollo or REST; no JSX
├── store/         # Zustand / local state (optional)
├── utils/         # Pure helpers
└── routes/        # Path helpers or re-exports (no Next route.tsx here)
```

**Rules**

- **Pages** live in `src/app/...` only; modules expose components, hooks, and services.
- **No duplicate GraphQL** — reuse **fragments** from `api/fragments.js` where possible.
- **Apollo 4**: use `gql` from `@apollo/client`; React hooks from `@apollo/client/react`.
- **If a file grows past ~200 lines**, split it (e.g. `product-service-list.js` + `product-service-detail.js`, or extra fragment files).

## Example: product module

- **SSR listing**: `app/[locale]/products/page.jsx` uses `getClient()` → `fetchProducts` / `fetchProductSearch`.
- **SSR PDP**: `app/[locale]/products/[slug]/page.jsx` uses `fetchProductBySlug`, **JSON-LD**, `generateMetadata`.
- **Client UI**: `ProductGrid`, `ProductCard`, `ProductDetail`, `ProductPageShell` (add-to-cart).

## GraphQL & auth

1. Set `WPGRAPHQL_URL` to your WordPress GraphQL endpoint (server).
2. With **`NEXT_PUBLIC_USE_GRAPHQL_PROXY=true`**, the browser Apollo client posts to **`/api/graphql`**, which forwards the body to WordPress and adds `Authorization: Bearer …` from the **`auth_token` httpOnly cookie** (set by `POST /api/auth/login`).
3. **`register-client.js`** builds a **public** RSC client (catalog SSR). Logged-in server rendering would need a separate pattern (e.g. `fetch` + cookie header) if you require JWT on the server.

Adjust login/register mutations in `src/app/api/auth/*` to match your **JWT** plugin schema.

## i18n

- URLs are **`/{locale}/...`** (`en`, `fr` defined in `src/config/i18n.js`).
- **`LanguageSwitcher`** sets `NEXT_LOCALE` cookie and swaps the first path segment.
- **Translated WordPress content**: add Polylang/WPML + GraphQL extensions, then extend queries/middleware (e.g. language in GraphQL context) — hooks are ready in `LocaleProvider` (`wpLocale`).

## Multi-currency

- `CurrencyProvider` + **`staticRatesFromBase`** in `src/config/currency.js` (replace with a live rates API in production).
- **WooCommerce still charges in the store currency** — this layer is **display** conversion unless you add a gateway that supports multi-currency.

## SEO

- **`generateMetadata`** on main routes.
- **`src/app/sitemap.js`** — builds URLs per locale; pulls product slugs via GraphQL (`revalidate` 1h).
- **`src/app/robots.js`**
- **JSON-LD** on product detail (`src/lib/seo/json-ld.js`).

## Images

Configure `images.remotePatterns` in `next.config.mjs` for your WordPress media hostname.

## Env

Put all variables in **`.env`** at the project root (same folder as `package.json`). Restart the dev server after changes.

**Header (BONNOT-style, WordPress):** set `WP_MENU_NAME` or `WP_MENU_LOCATION` and `NEXT_PUBLIC_WP_SITE_URL`. Optional: `NEXT_PUBLIC_SITE_NAME`, `WP_ANNOUNCEMENT_PAGE_SLUG` (Page slug for the navy top bar text), `NEXT_PUBLIC_TOP_BAR_TEXT`, `NEXT_PUBLIC_CONTACT_PATH`.

**Menus:** parent items **with children** open a **mega panel** (cream background, two columns). Mega **image**: link the parent to **Media** or a **Page with featured image**, or put an image URL / `<img>` in the menu item **Description** (enable *Description* under Screen Options). **CSS classes** on items: `menu-accent` (gold tone), `is-contact` or `contact-cta` (drives the *Contact us* button URL). If GraphQL errors on `connectedObject`, remove that block from `src/modules/menu/api/fragments.js`.

## Scripts

```bash
npm run dev
npm run build
npm start
```

## New module checklist

1. Create the seven folders (`api`, `components`, `hooks`, `services`, `store`, `utils`, `routes`).
2. Add GraphQL in `api/`; keep fragments reusable.
3. Add `services/` for Apollo calls used by Server Components.
4. Add `hooks/` + `components/` for client interactivity.
5. Wire **`src/app/...`** routes to module exports — keep route files short.

This structure is intentionally flat and **JSX-first** so you can open one module and find every layer in the same shape.
