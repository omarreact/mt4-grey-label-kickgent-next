# Universal AI Engineering Guidelines

These instructions apply to **any AI assistant, coding agent, IDE assistant or automation** working in this repository. Read this file before changing code, content, styles, tests or the WordPress FSE theme.

## Product and design source of truth

1. Read `DESIGN.md` before modifying anything user-facing.
2. Preserve the approved Kickgent visual identity: dark technical brokerage design, purposeful violet highlights, editorial type and balanced long-form content density.
3. Do not add public HTML entry pages, `/source/` fallback routes, generic purple-to-blue text gradients, emoji feature tiles, arbitrary glass panels or unrelated design motifs.
4. Use Next.js App Router components and keep all public pages accessible at their existing root routes.

## UX and accessibility requirements

- Every interactive control must be keyboard-operable with a visible focus state.
- Touch controls require a 44×44px minimum coarse-pointer target.
- Never disable browser zoom with `user-scalable=no` or `maximum-scale`.
- Respect `prefers-reduced-motion`.
- Add clear pending/loading feedback before introducing an asynchronous action or form submission.
- Preserve semantic headings, table labels, image alt text and contrast.

## Implementation discipline

- Make the smallest safe change that meets the requirement.
- Keep the WordPress FSE theme aligned with `DESIGN.md`.
- Do not overwrite approved content, assets, deployment settings or integrations without explicit authorization.
- Do not claim a visual or browser test passed without actual evidence.

## Required quality gates

Run these when dependencies are available:

```bash
npm run audit:design
npm run check
npm run test:ui
```

The Playwright suite must cover every public route plus homepage navigation, tabs and FAQ behavior. Capture desktop and mobile screenshots for visual changes. Resolve overlap, overflow, hidden controls and broken interaction before handoff.

## Instruction adapters

This file is the canonical rule set. Project-specific adapters point here for Codex/OpenAI (`AGENTS.md`), Claude (`CLAUDE.md`), Gemini (`GEMINI.md`), GitHub Copilot (`.github/copilot-instructions.md`) and Cursor (`.cursor/rules/kickgent-design.mdc`).
