# GreyLabel Technology — repository audit

Audit basis: `main` at `2d39dafe29708f6ad8126433e9a1aaf768b5df8f` before the revised PinTheme implementation batch.

## Framework inventory

- Next.js: package range `^15.4.9` using App Router.
- React / React DOM: `^19.2.1`.
- TypeScript: `^5.9.3`.
- Existing page source: `content/kickgent-pages.ts` plus `content/site.ts`.
- Existing shared runtime chrome: `components/SharedSiteChrome.tsx`.
- Existing page compatibility CSS: `app/site-pages.css` and page-level canonical CSS inside `content/kickgent-pages.ts`.
- Existing browser QA: Playwright desktop + mobile Chromium.
- Existing WordPress proof of concept: classic PinTheme theme plus older FSE/sync experiments.

Tailwind CSS was **not installed or configured** at the audit commit. The revised specification therefore requires a staged styling migration rather than pretending the legacy page CSS is already Tailwind-native.

## Route inventory

1. `/`
2. `/mt4-grey-label/`
3. `/mt5-grey-label/`
4. `/turnkey-grey-label/`
5. `/forex-broker-crm/`
6. `/forex-broker-website/`
7. `/forex-liquidity-bridge/`
8. `/pamm-mam/`
9. `/how-to-start-forex-brokerage/`
10. `/scale-forex-brokerage/`
11. `/about/`

## Header / footer audit

The runtime already used `SharedSiteHeader` and `SharedSiteFooter`, but legacy `SiteHeader.tsx` and `SiteFooter.tsx` still contained a second implementation. The revised implementation converts those files to aliases of the shared chrome and moves the shared chrome styling to Tailwind utilities.

Navigation hierarchy is retained:

- Home
- Solutions
  - MT4 Grey Label
  - MT5 Grey Label
  - Forex Broker CRM
  - PAMM & MAM Plugins
  - Liquidity & Bridge
  - Broker Website
- Guides
  - Start a Brokerage
  - Scale Your Brokerage
  - Turnkey Brokerage
- About

## Export compatibility

- Next.js static export is compatible with all 11 current routes.
- GitHub Pages requires a repository base path; the revised export pipeline sets `/mt4-grey-label-kickgent-next` only for the HTML view.
- WordPress can run without Next.js/Node.js by using native PHP templates, precompiled CSS, native menus, and minimal JavaScript.
- Page-specific canonical CSS is still required for exact visual parity during the migration. It is generated as `source-parity.css` rather than being silently discarded.

## Explicit gaps after this implementation batch

- Full conversion of all 11 page-specific canonical styles into Tailwind/component schemas.
- WordPress Media Library import from the development asset manifest.
- Private GitHub App/OAuth authentication.
- Automated WordPress theme release installation.
- Full theme/database rollback.
- Installed WordPress staging QA and three-way visual regression.
- Lighthouse/Core Web Vitals verification.
