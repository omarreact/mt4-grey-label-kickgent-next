# GreyLabel Technology — PinTheme proof of concept

This repository is the initial proof of concept for **PinTheme by PINCODE IT**. GitHub is the source of truth for development code and release artifacts. The approved website is developed in Next.js + React + TypeScript with Tailwind CSS as the shared design-system layer, then produces independently usable HTML and native WordPress outputs.

## Project identity

- Site: **GreyLabel Technology**
- Frontend short brand: **GreyLabel**
- Theme name: **GreyLabel Technology**
- Theme slug / text domain: `greylabel-technology`
- Design reference: Kickgent (reference only; it is not the WordPress theme name)
- Source repository: `omarreact/mt4-grey-label-kickgent-next`

## Three project views

| View | Purpose | URL/status |
| --- | --- | --- |
| Next.js | Development/reference | `https://mt4-grey-label.vercel.app/` — configured; verify separately |
| HTML | Standalone static output | `https://omarreact.github.io/mt4-grey-label-kickgent-next/` — deployed through GitHub Pages |
| WordPress | Production CMS | Project-configurable; no production/staging URL is hardcoded |

The HTML view is marked **DEPLOYED**, not **VERIFIED**, until an independent frontend request confirms the published Pages URL outside the deployment runner.

## Routes

The canonical source currently exports 12 routes: `/`, `/mt4-grey-label/`, `/mt5-grey-label/`, `/turnkey-grey-label/`, `/forex-broker-crm/`, `/forex-broker-website/`, `/forex-liquidity-bridge/`, `/pamm-mam/`, `/how-to-start-forex-brokerage/`, `/scale-forex-brokerage/`, `/about/`, and `/contact/`.

## Architecture

- Next.js development source: `app/`, `components/`, `content/`
- Tailwind/CSS-variable bridge: `app/globals.css`, `styles/pintheme-tailwind.css`, `pintheme/design-tokens.json`
- Static HTML export: `out/`
- Native WordPress theme: `wordpress/greylabel-technology/`
- Reusable companion plugin: `wordpress/pintheme-manager/`
- Compatibility contract: `pintheme/compatibility-registry.json`
- Versioned manifest: `pintheme.manifest.json`

Legacy `wordpress/kickgent-fse/`, `wordpress/kickgent-github-sync/`, and `wordpress/kickgent-pintheme/` folders are historical references only. They are not the production PinTheme output.

## WordPress production model

Production WordPress runs on PHP + WordPress APIs + precompiled CSS + minimal JavaScript. It does **not** require Next.js, Node.js, npm, pnpm, Vercel, a Tailwind compiler, Elementor, or Full Site Editing.

The theme exposes global brand/header/typography/layout/footer settings through CSS custom properties. PinTheme Manager adds project views, validated GitHub manifest access, safe content import, local-edit protection, navigation bootstrap, version metadata, content snapshots, rollback, read-only code viewing, and system status.

Automated Media Library mirroring, private GitHub App/OAuth authentication, release installation, full theme-package rollback, and a verified WordPress staging installation remain separate implementation phases and are not silently claimed complete.

## Commands

```bash
npm ci
npm run audit:design
npm run validate
npm run typecheck
npm run build:pintheme
npm run build:css
npm run build
npm run export:html
npm run validate:pintheme
npm run generate:wordpress
npm run check
npm run test:ui
```

## CI

- `sync-wordpress.yml` validates source, compiles Tailwind, lints PHP, packages versioned HTML/theme/plugin artifacts, and synchronizes generated metadata.
- `pages.yml` builds the base-path-aware standalone HTML view and deploys it to GitHub Pages.
- `ui-qa.yml` runs browser interaction and responsive smoke tests.
- `release.yml` publishes versioned artifacts only when an explicit `v*` tag is pushed.

## Auto-generated all-pages single HTML

Run `npm run export:single-html` to build the whole Next.js site into **`template/website.html`**. The exporter uses the same 12 static route outputs, embeds the compiled Tailwind CSS, retains all 12 rendered pages in HTML `<template>` blocks, and provides hash URLs such as `website.html#/mt4-grey-label`. All content is generated from the Next.js source, not maintained separately. The existing PinTheme distribution workflow regenerates and commits the file when source changes on `main`. External photo URLs still require a connection; compiled Next.js JavaScript is replaced by lightweight native controls for the template view. Keep this generated file read-only and update source components/content instead.
