# Kickgent Next.js + WordPress FSE generator

This folder ships the existing `kickgent/` website inside a Next.js 15 project with exact source parity:

- `public/source/` contains an immutable copy of the original home page, all ten linked pages, shared CSS and shared JavaScript. The Next.js routes redirect to that source so the production DOM, responsive styles, navigation, tabs and accordions remain exactly as approved.
- `wordpress/kickgent-fse/` is a WordPress 6.6+ Full Site Editing theme with editable site header, footer, navigation, page content, global tokens and a reusable hero pattern.
- `scripts/generate-wordpress-theme.mjs` produces a clean installation folder in `dist/kickgent-fse/` without changing source files.

## Local use

```bash
npm install
npm run check
npm run generate:wordpress
```

Install `dist/kickgent-fse` on a staging WordPress site. In **Appearance → Editor**, edit global styles, header/footer and page patterns. Create pages using the slugs in `content/site.ts`, set Home as the static front page, then populate navigation in the Site Editor.

The original static `kickgent/` directory remains untouched. The parity copy is made from that source by `scripts/sync-source.mjs`; the new project intentionally does not alter GitHub Pages or production hosting.
