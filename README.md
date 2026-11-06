# Kickgent — Next.js + WordPress FSE

A fully App Router based implementation of the approved Kickgent brokerage website.

## Next.js routes

- `/` — Home page
- `/mt4-grey-label`, `/mt5-grey-label`, `/turnkey-grey-label`
- `/forex-broker-crm`, `/forex-broker-website`, `/forex-liquidity-bridge`, `/pamm-mam`
- `/how-to-start-forex-brokerage`, `/scale-forex-brokerage`, `/about`

All pages are served by Next.js components. There is no public `index.html` entry point and no `/source/` path.

## Commands

```bash
npm install
npm run validate
npm run build
npm run generate:wordpress
```

## WordPress theme

The installable WordPress 6.6+ Full Site Editing theme lives in `wordpress/kickgent-fse/`. Run `npm run generate:wordpress` to create the clean install folder at `dist/kickgent-fse/`.
