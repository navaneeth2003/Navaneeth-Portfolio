# Build notes — design token system

Derived from `ui.png` (brand canvas — wins for color/type/layout) and
`Portfolio_Master_Build_and_Brand_Specification.md` (wins where the canvas is silent).

## Palette

| Token          | Hex       | Use                                                    |
| -------------- | --------- | ------------------------------------------------------ |
| `bg`           | `#FAFAF8` | Page background (soft warm off-white)                  |
| `surface`      | `#FFFFFF` | Cards                                                  |
| `ink`          | `#0B0D10` | Headings, primary text, primary buttons                |
| `muted`        | `#687280` | Secondary text, labels, dates                          |
| `line`         | `#E8E6E1` | Hairline borders and dividers                          |
| `accent`       | `#B9854C` | Warm gold — the accented word in headings, active dots |
| `accent-soft`  | `#F3EAD9` | Tan chip/pill backgrounds                              |
| `accent-ink`   | `#7C5A2E` | Text on tan chips                                      |

Functional colors (studio only): success `#22C55E`, warning `#F59E0B`, danger `#EF4444`.
The blue `#2563EB` from the master spec is superseded by the canvas: the hero's accent
("meaningful impact.", the tan PRODUCT MANAGER chip, the gold dot in "Navaneeth.") is warm gold.

## Type

- One family: **Inter** (the canvas typography card says Inter; master spec's Plus Jakarta Sans
  loses per the precedence rule). Weights 400 / 500 / 600 / 700.
- Display: Inter 600–700, tight tracking (`-0.02em`), large sizes.
- Body: Inter 400/500 at 15–17px, relaxed leading.
- Utility (labels, dates, credential IDs): 11–12px, uppercase, `+0.08em` tracking, muted.

## Spacing & layout rhythm

- 8pt scale: 8, 16, 24, 32, 40, 48, 64, 80, 96, 128.
- Content column `max-w-6xl` (1152px), page gutter 20px mobile / 24px tablet / 32px desktop.
- Sections separated by 96–128px of whitespace; bento-style white cards on the cream page.
- Radii: cards 24px, inputs 12px, buttons 14px, chips/pills full.
- Shadows: `0 8px 30px rgba(0,0,0,.04)` max. Borders 1px `line`.
- Icons: Lucide, outline, 2px stroke.

## Signature element

**The gold period.** The wordmark is "Navaneeth**.**" with a gold dot; every section heading
ends its key word in the warm gold accent (like "meaningful impact." on the canvas), and the
experience highlight line is a gold-tinted callout with a gold left rule. This one treatment —
near-black type finished with a warm gold mark — repeats everywhere and is the recognizable thing.

## Motion

200ms ease-out, opacity + small translateY only, no bounce. Fully disabled under
`prefers-reduced-motion`.

In practice: the hero rises in with a staggered fade on load; each section fades up
once as it enters the viewport (`[data-reveal]` + `RevealObserver`, no-JS-safe — without
JS everything is simply visible); hovers are border-color/lift/arrow-nudge only.

## Elevated treatments (post-audit)

- **Tagline as role pills.** The comma-separated tagline renders as wrapping pills
  (one credential per pill) instead of a single truncating chip — nothing ever clips,
  at any width. The 80-char limit still applies in the studio.
- **Outcome-first experience cards.** The highlight renders as a labeled "Key outcome"
  gold callout *above* the bullets: recruiters scan the result first, then the evidence.
- **Editorial About.** The first paragraph is set larger and darker as a lead; the rest
  step down — one text block becomes a readable arc.
- **Scroll-spy nav.** The active section gets a gold underline; hover shows a half-width
  underline. The wordmark stays the anchor home.
- **Designed placeholders.** Empty image slots render a dot-grid tile with an initial —
  intentional, not broken — until real assets are uploaded through the studio.
