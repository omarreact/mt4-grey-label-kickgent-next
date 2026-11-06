# Kickgent — Next.js + WordPress FSE

A fully App Router based implementation of the approved Kickgent brokerage website.

## Next.js routes

- `/` — Home page
- `/mt4-grey-label`, `/mt5-grey-label`, `/turnkey-grey-label`
- `/forex-broker-crm`, `/forex-broker-website`, `/forex-liquidity-bridge`, `/pamm-mam`
- `/how-to-start-forex-brokerage`, `/scale-forex-brokerage`, `/about`

All pages are served by Next.js components. There is no public `index.html` entry point and no `/source/` path.

## Design and QA workflow

- `DESIGN.md` is the brand-token, component and motion source of truth.
- `CLAUDE.md` defines the mandatory implementation and quality rules.
- `npm run audit:design` checks the design-system guardrails.
- `npm run test:ui` runs Chromium desktop/mobile route, interaction and screenshot checks.
- `.mcp.json` configures the official Microsoft Playwright MCP server, pinned to `@playwright/mcp@0.0.84`.
- GitHub Actions uploads the Playwright report and screenshots for every pull request and `main` update.

## Commands

```bash
npm install
npm run audit:design
npm run check
npm run test:ui
npm run generate:wordpress
```

## WordPress theme

The installable WordPress 6.6+ Full Site Editing theme lives in `wordpress/kickgent-fse/`. Run `npm run generate:wordpress` to create the clean install folder at `dist/kickgent-fse/`.
