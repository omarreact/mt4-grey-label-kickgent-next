# Kickgent Design System

## Product character

GreyLabel is a premium, technical brokerage-technology brand. The approved identity is dark, confident and editorial—not playful fintech, crypto-neon, or generic SaaS. Preserve the existing information architecture and page hierarchy unless a requirement explicitly changes it.

## Visual tokens

| Token | Value | Use |
|---|---|---|
| Canvas | `#100414` | Main page background |
| Surface | `#180a21` / `#24102f` | Cards and elevated panels |
| Primary violet | `#9448f7` | Primary actions and active states |
| Light violet | `#d7aaff` | Borders, focus and highlights |
| Main text | `#fcf8ff` | Primary copy |
| Muted text | `#c7b6d0` | Supporting copy |
| Divider | `#ffffff20` | Quiet separation |

Use the established violet gradients only as contained brand surfaces, buttons and visual artwork. Do **not** add generic purple-to-blue headline gradients, rainbow effects, or ungrounded glass cards.

## Type and spacing

- Font stack: `Inter, ui-sans-serif, system-ui, sans-serif`.
- Display headings: tight tracking, `line-height: 1.03–1.15`; body copy: readable `1.6–1.8` line-height.
- Desktop content width: `1180px` maximum. Mobile gutters: at least `16px`.
- Use the established rhythm: 12–18px within cards, 24–34px component spacing, 78–115px section spacing.
- Avoid new arbitrary radii. Existing 11px, 16–20px and 24px radii correspond to button, panel and feature-container levels.

## Components and interaction

- Buttons must show a visible keyboard focus ring and remain legible in all states.
- Touch controls must have a 44×44px target when used on a coarse-pointer device.
- Motion should be subtle and purposeful: status, depth, reveal and navigation feedback. Respect `prefers-reduced-motion`.
- Icons must be intentional SVG or existing text symbols; do not introduce emoji icon tiles.
- Every visual change needs desktop and mobile browser evidence before merge.

## Content density

Keep page density balanced: substantial technical detail is expected, but headings, comparison tables and CTA blocks need clear breathing room. Do not collapse the long-form brokerage pages into marketing-card grids.

## WordPress FSE parity

Any new FSE pattern must reuse these tokens and preserve semantic headings, focus handling and mobile spacing. The FSE theme is editable; it is not permission to create a second visual identity.
