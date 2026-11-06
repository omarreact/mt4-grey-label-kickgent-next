# PinTheme implementation status — GreyLabel Technology

## Implemented in this repository

- GitHub-first project configuration and manifest generation.
- Correct project identity: GreyLabel Technology / `greylabel-technology`.
- Shared Tailwind CSS entrypoints for Next.js and generated WordPress CSS, with CSS custom properties for WordPress-controlled design values.
- Shared Next.js header/footer and grouped desktop/mobile navigation.
- Eleven-route Next.js static export.
- GitHub Pages deployment workflow with repository base-path support and export validation.
- Native Classic/Hybrid WordPress theme with PHP templates, `theme.json`, custom logo, native menus, archives, search, responsive navigation, settings, and no Node.js production dependency.
- PinTheme Manager dashboard, Project Views, public GitHub connection, validated manifest/content feed, safe content import, local-edit protection, menu bootstrap, content backups/rollback, version history, read-only code viewer, global-component links, and system status.
- SHA-256 content-feed integrity validation.
- CI for TypeScript, Next.js build/export, Tailwind compilation, PHP syntax, packaging, Playwright interaction tests, GitHub Pages, and opt-in tagged releases.

## Transitional compatibility layer

The existing approved page designs predate Tailwind and still contain project-specific canonical CSS in `content/kickgent-pages.ts` and `app/site-pages.css`. PinTheme now uses Tailwind for the shared global chrome and WordPress production bundle while preserving that CSS as generated `source-parity.css` so the approved design is not silently redesigned. A full component-schema migration of every page section to Tailwind-native renderers remains unfinished.

## Not yet complete

- Private-repository GitHub App/OAuth authentication.
- Release selection and automatic WordPress theme ZIP installation.
- Development asset → WordPress Media Library import and reference rewriting.
- Full theme-package/database rollback; current rollback covers PinTheme content snapshots.
- Advanced writable code editor.
- Disposable WordPress staging installation/activation QA.
- Three-way screenshot visual-regression comparison against an installed WordPress domain.
- Formal Lighthouse/Core Web Vitals gates.
- Complete conversion of every legacy page section into the reusable component-schema library.

These gaps are explicit in the manifest capability flags and should be treated as later phases rather than simulated functionality.
