# Frontend Design Engineering Rules

## Required sequence

1. Read `DESIGN.md` before changing a visual component.
2. Preserve the approved Kickgent hierarchy, typography, palette and interaction patterns.
3. Run `npm run audit:design`, `npm run check` and `npm run test:ui` before handoff when dependencies are installed.
4. Include desktop and mobile screenshot evidence from Playwright for visual changes.

## Implementation rules

- Use Next.js App Router routes and components. Do not add public HTML entry pages or a `/source/` compatibility route.
- Keep the approved violet identity, but do not add generic purple-to-blue gradient headings, decorative emoji tiles, excessive glassmorphism or arbitrary gradients.
- Preserve keyboard access, visible focus states, reduced-motion behavior and 44px coarse-pointer targets.
- Never block browser zoom with `user-scalable=no` or `maximum-scale`.
- Async actions need clear pending/loading feedback. There are currently no async forms; add a visible loading state before introducing one.
- Keep the WordPress FSE theme aligned with `DESIGN.md`.

## Visual QA gate

Playwright must check every public route, mobile navigation, homepage tabs and FAQ interaction. Capture screenshots as test artifacts. Fix overflow, overlap, hidden controls and contrast regressions before merging.
