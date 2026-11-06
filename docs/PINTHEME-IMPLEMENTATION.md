# PinTheme implementation status — Kickgent proof of concept

## Implemented

- GitHub-first source model with `pintheme.config.mjs`.
- Shared design-token and component-compatibility registries.
- Next.js static export for all 11 approved routes.
- Native classic WordPress theme with PHP templates, `theme.json`, custom logo, native menus, responsive hamburger/dropdowns, and global settings outside FSE.
- Generated source-parity stylesheet and content feed from the canonical Next.js page source.
- PinTheme manifest with SHA-256 content integrity verification.
- PinTheme Manager with repository/branch configuration for public GitHub packages, import preview, safe content synchronization, local-edit conflict detection, menu bootstrap, update state, backup snapshots, and rollback.
- CI validation for TypeScript, Next.js build/static export, PinTheme manifests, PHP syntax, and ZIP artifact packaging.

## Intentionally partial / later phases

- Private GitHub repository authentication via GitHub App or OAuth.
- Release API browsing and automatic theme ZIP installation.
- Media Library mirroring and remote media conflict handling.
- Full Theme Manager live responsive preview UI.
- Advanced code viewer/editor and Git-aware draft editing.
- Automated disposable WordPress staging environment and screenshot parity comparisons between Next.js/HTML/WordPress.
- Formal Lighthouse/Core Web Vitals gates.

These items remain separate because they require credentials, a WordPress staging runtime, or broader product infrastructure. The current implementation does not silently simulate them.
