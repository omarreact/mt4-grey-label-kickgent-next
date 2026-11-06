# Design QA — exact-source parity

- Source visual truth: https://omarreact.github.io/mt4-grey-label/kickgent/
- Captured source viewport: 1340 × 918 CSS px in the cloud browser.
- Source state captured: default home; Solutions menu expanded; PAMM/MAM workflow tab selected; first FAQ item expanded.
- Implementation target: `kickgent-next/public/source/` served by the Next.js routes.

## Evidence

The parity build copies the original home document, ten page documents, shared `site-pages.css`, and shared `site-pages.js` without modification. These files preserve the approved DOM, content, responsive breakpoints, dropdown navigation, tabs, accordions and animations.

## Required fidelity surfaces

- Fonts and typography: preserved from the original document and shared styles.
- Spacing and layout rhythm: preserved from the original document and shared styles.
- Colors and visual tokens: preserved from the original document and shared styles.
- Image quality and assets: original image URLs and treatments are retained without replacement.
- Copy and content: original home and ten page documents are retained without rewriting.

## Primary interactions captured

- Solutions navigation opens its six-page dropdown.
- Workflow tabs replace the active panel content.
- FAQ buttons expand and collapse their answers.

## Blocker

The Vercel connection can read the team but still returns `403 forbidden` for project creation. The local workspace does not contain the copied public-source tree, so a browser-rendered Next.js parity capture cannot be made locally either.

## Final result

final result: blocked
