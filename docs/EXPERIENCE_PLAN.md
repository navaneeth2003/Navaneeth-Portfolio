# Experience Design Plan — "The Gold Period"

The interaction-model redesign of the portfolio. Written before implementation; each
section below is the contract for what gets built. Hard constraints that survive every
creative decision:

1. **Content is editable.** Every animation must work for any schema-legal content
   (0 → max items, min → max lengths). No animation may assume fixed sizes.
2. **One component per section**, shared by the public site and the studio preview.
3. **Reduced motion = a calm, fully static site.** Not "less animation" — none.
4. **60fps floor**: transform + opacity only, scroll-linked values on the compositor,
   no layout-triggering animation, no CLS.
5. The brand physics: ease `cubic-bezier(0.2, 0.6, 0.2, 1)`, springs critically damped
   (no bounce), 200–500ms. Motion is choreographed, never busy.

## The signature motif

**The gold period is the protagonist.** It already ends the wordmark and every heading.
Now it moves:

- It **lands** — every section heading animates its text first, then the gold dot
  scales in to "finish the sentence." Same beat, everywhere. This is the memory hook.
- It **travels** — the experience timeline's milestone nodes are gold periods that pop
  as the rail draws past them.
- It **measures** — the nav's scroll progress is a gold hairline filling left → right.
- It **says goodbye** — the footer dot emits one soft ring when you reach the end.

Every other motion decision supports this one idea. Cohesion comes from the shared
physics; personality comes from *what* moves per section, never from new easings.

## Stack

- **`motion`** (Framer Motion successor) — springs, scroll-linked values
  (`useScroll`/`useTransform`), staggered orchestration, in-view triggers.
- **`lenis`** — scroll smoothing (lerp ≈ 0.1). Desktop pointer-fine only; disabled on
  touch and under reduced motion. No scroll hijacking — native wheel deltas, smoothed.
- No GSAP (motion covers every need; two animation runtimes is a smell).
- One `MotionProvider` handles reduced-motion detection and Lenis lifecycle; a
  `useMotionOK()` hook gates every effect.

## Explicitly excluded (and why)

- **Custom cursor** — hides the affordance users know, does nothing on touch, and
  directly contradicts "the interface should disappear." The premium references
  (Apple, Stripe, Linear, Vercel) all use the native cursor. Context-aware *element*
  states do the work instead.
- **Ripples / glow-heavy buttons** — Material's language, not this brand's.
- **Alternating slide directions in the timeline** — zigzag entrances force zigzag
  reading. Direction has meaning: work history flows down one rail.
- **Testimonials section** — outside the schema and the spec's non-goals; testimonials
  without recognizable names dilute seniority rather than adding it.
- **Horizontal scroll sections** — with the current content depth they'd be a corridor
  with two doors. Reconsider when a vertical has 4+ projects.
- **In-site case study pages** — the strongest future move (sticky storytelling,
  animated metrics, Problem→Impact scenes) but it's a schema + content change:
  needs new fields and Navaneeth's real case study material. Proposed as Phase 2,
  not smuggled into this release.

---

## Global fabric

| | |
|---|---|
| UX goal | The page feels like one continuous, guided piece |
| Scroll | Lenis smoothing (desktop, pointer-fine, motion-OK only) |
| Progress | 1.5px gold hairline under the nav header, width = scroll progress (scroll-linked, compositor-only) |
| Nav | Transparent over the hero; gains blur + hairline border after ~24px scroll. Scroll-spy underline (exists) upgraded to a shared animated underline that *slides* between links instead of appearing per-link |
| A11y | Skip link (exists), focus states never animated away, `useMotionOK()` gates all of the above |
| Perf | Lenis + one `useScroll` at root; everything derives from it |

---

## Hero — *The opening title*

| | |
|---|---|
| Currently weak | Pleasant but instant — everything is just *there*; no sense of arrival |
| Emotion now → target | "clean template" → "opening title of something crafted" |
| Visual direction | Unchanged layout (canvas-approved); add one soft warm radial gradient drifting very slowly behind the portrait side (~0.4 opacity, 60s loop) |
| Entrance | Choreography, total ≈ 1.1s: (1) role pills cascade in 60ms apart → (2) name reveals **word by word** through overflow masks (rise from below each line) → (3) the gold period lands (scale 0.5→1, opacity, critically damped) → (4) bio + CTAs rise together |
| Scroll behaviour | Gentle exit: hero copy translates up at 1.05× scroll and fades by ~40% viewport; portrait layers move at three depths (photo 1×, tan disc 0.94×, dot grid 0.88×) |
| Mouse | Portrait cluster responds to pointer with lerped 3-layer translate (max 6/10/14px). Pointer-fine only |
| Hover | CTAs: arrow nudge (exists) + 0.98 press scale |
| Mobile | Same entrance, 20% faster; no mouse response; scroll parallax retained (cheap transforms) |
| A11y | Words are real text; masks are visual only. Reduced motion: fully static |
| Perf | Word spans only in the h1 (max 60 chars — bounded); gradient is one composited layer |

## About — *The essay*

| | |
|---|---|
| Currently weak | Good typography, but the lead paragraph is passive; nothing rewards reading |
| Emotion now → target | "a bio" → "I'm being told a story at my pace" |
| Entrance | Heading words rise through masks; the period lands (the shared beat) |
| Scroll behaviour | **Scroll-scrubbed word reveal** on the lead paragraph: every word starts at 25% ink and reaches full ink as it crosses the reading band (Apple keynote-page pattern). Scrubbing = tied to scroll position, reversible, never autoplaying |
| Exit | None (calm sections don't exit — they settle) |
| Hover | None. This section is for reading |
| Mobile | Identical (scrub is transform-free: opacity/color per word) |
| A11y | Reduced motion: full-ink text, period. Screen readers get one unbroken paragraph (aria-hidden word spans + visually-hidden full text) |
| Perf | Word count bounded by the 1500-char limit; one `useScroll` for the paragraph; color/opacity only |

## Stats — *The odometer*

| | |
|---|---|
| Currently weak | The most hireable numbers on the page sit still |
| Emotion now → target | "a table" → "momentum — these numbers moved for a reason" |
| Entrance | Hairline dividers draw (scaleY), then each stat: number **counts up** ~800ms ease-out (numeric prefix parsed from the value string; the "+" suffix pops after the count lands), label fades up after. 90ms stagger between stats |
| Scroll behaviour | Triggers once at 40% in view; no scrubbing (counts must complete) |
| Hover | None (data, not controls) |
| Mobile | Same; 2-col grid as today |
| A11y | The real string ("12+") is always in the DOM for AT; the count is `aria-hidden`. Reduced motion: static values |
| Perf | Count-up via motion value → text, no re-render per frame; icon/empty-value stats fall back to fade |

## Experience — *The timeline that draws itself* (structural rebuild)

| | |
|---|---|
| Currently weak | A stack of look-alike cards; four roles read as four separate facts, not a trajectory |
| Emotion now → target | "a list of jobs" → "an accelerating career, walked top to bottom" |
| Visual direction | **Rebuilt as a true timeline**: a gold rail on the left (desktop: 24px gutter left of cards; mobile: 16px), cards hang off it. Each card keeps its internals (outcome-first callout stays) |
| Scroll behaviour | The rail **draws itself** scroll-linked (scaleY 0→1 across the section). As the drawn edge passes each role, its **gold period node pops** (scale + tiny ring) and the card slides in from the right (24px) with its date chip trailing 60ms behind |
| Entrance detail | Inside each card: "Key outcome" gold rule draws (scaleY), then text fades in; bullets stagger 40ms |
| Exit | None; passed cards rest at full opacity (history doesn't fade) |
| Hover | Card lifts 2px, border deepens; the card's node brightens — hover *anywhere* reinforces the rail |
| Mobile | Same rail at the left edge; cards slide up instead of sideways (no horizontal motion near screen edges) |
| A11y | Rail + nodes `aria-hidden`; DOM order unchanged; reduced motion: rail fully drawn, static |
| Perf | Rail is one element with `transform-origin: top`; node pops via in-view thresholds, not per-frame JS |

## Projects — *The gallery*

| | |
|---|---|
| Currently weak | Cards are competent but inert; covers are placeholders; nothing invites the hand |
| Emotion now → target | "portfolio grid" → "exhibits in a gallery — lean in" |
| Visual direction | Adaptive layout: a vertical with 1 item renders its card **featured** (media left / story right on desktop) instead of a half-empty grid; 2+ items use the 2-col grid. Bento emerges naturally as content grows |
| Entrance | Vertical label types its counter ("1 project") after the group heading rises; cards rise with 80ms stagger; cover image de-blurs from 8px as it rises (the one blur allowed, per card, once) |
| Scroll behaviour | Cover image parallaxes inside its fixed-ratio frame (±6% translateY) — depth without layout risk |
| Hover | Three layered responses, all springs: (1) tilt max 2.5° toward cursor, (2) a faint warm **spotlight** (radial gold, ~6% opacity) tracking the pointer across the card, (3) cover scales 1.03. Links: arrow nudges (exists) |
| Micro | "Results & impact" panel: gold rule draws when the card enters view |
| Mobile | No tilt/spotlight (touch); parallax + entrance retained; featured layout stacks |
| A11y | Tilt/spotlight are decorative and pointer-fine-gated; card remains a normal DOM block, links are links |
| Perf | Tilt/spotlight via motion values on GPU transforms + CSS vars; listeners per hovered card only |

## Tools — *The kit*

| | |
|---|---|
| Currently weak | Honest grid, zero delight; proficiency dots are static ink |
| Emotion now → target | "inventory" → "a well-worn toolbox, opened" |
| Entrance | Tiles cascade diagonally (row+col based delay — a wave across the grid, distinct from every other section), each rising with 0.96→1 scale |
| Micro | Proficiency dots **fill sequentially** (1→2→3) 150ms after each tile lands — "animated proficiency" with zero chart bloat |
| Hover | Tile lifts; its dots re-pulse once |
| Mobile | Same wave, 2-col |
| A11y | Level text ("Intermediate") is the accessible truth; dots decorative |
| Perf | Pure CSS-var delays computed from index; bounded by 16-item cap |

## Skills — *The clusters*

| | |
|---|---|
| Currently weak | Pills appear all at once; groups feel identical |
| Emotion now → target | "keyword dump" → "organized mind" |
| Entrance | Group cards rise with column offsets; then each group's pills **pop in a burst** (scale 0.85→1, 35ms stagger) — reads as thoughts collecting into clusters |
| Hover | Group border deepens; the group's gold dot marker appears beside its category |
| Mobile | Single column, same bursts |
| A11y | Pills are static text after entrance; no continuous motion |
| Perf | Bounded 6 groups × 10 skills |

## Certifications — *The seals*

| | |
|---|---|
| Currently weak | Identical cards; award icon carries no weight |
| Emotion now → target | "list of PDFs" → "earned stamps" |
| Entrance | Badge/icon **stamps** in (scale 1.2→1 + opacity, fast settle — the press of a seal), then title/issuer rise; column stagger |
| Hover | A hairline gold ring traces the badge tile once |
| Mobile | Same, single/2-col |
| A11y | Stamp is entrance-only; credential IDs stay selectable text |
| Perf | Trivial; in-view once |

## Education — *The record*

| | |
|---|---|
| Currently weak | Fine, but abrupt — no sense of "closing the file" before contact |
| Emotion now → target | "footnote" → "the quiet, complete record" |
| Entrance | Row dividers **draw left → right** (scaleX), rows fade in sequence, years fade last — archival calm, the deliberate slow beat before the finale |
| Hover | Row background warms barely (bg tint) |
| Mobile | Identical |
| A11y / Perf | Static after entrance; trivial |

## Contact / Footer — *The signature*

| | |
|---|---|
| Currently weak | Correct but flat — the site just stops |
| Emotion now → target | "footer" → "a confident sign-off you feel" |
| Visual direction | Bookends the hero: the same soft warm gradient drifts behind the heading |
| Entrance | "Let's talk" rises; its gold period lands **and emits one soft expanding ring** — the only place the dot speaks twice. Contact buttons cascade |
| Micro | Email button is **magnetic** (≤4px pull toward cursor, pointer-fine only, spring release) — the single magnetic element on the site, reserved for the one action that matters. Click-to-copy chip beside the email (icon swaps to a check, "Copied") |
| Hover | Buttons as today + press scale |
| Mobile | No magnetism; copy chip retained; "Back to top" uses smooth scroll |
| A11y | Copy action announced via `aria-live`; ring decorative |
| Perf | One gradient layer; magnetism on one element |

---

## Performance & QA budget

- Added JS ≈ 35–45kb gz (`motion` tree-shaken + `lenis` ~3kb). Public page stays SSR;
  LCP element (name) is server-rendered text — entrance masks must not delay paint
  (CSS-first frame, JS enhances).
- Zero CLS: everything animates from already-laid-out state via transform/opacity.
- Verification gate before "done": 375/768/1440 screenshots, overflow = 0, DevTools
  performance trace of a full scroll ≥ 55fps average, reduced-motion run fully static,
  keyboard walk-through, studio preview sanity (same components, draft data).

## Build order

1. Foundation: deps, `MotionProvider` (Lenis + reduced-motion), scroll progress line, nav upgrade
2. Hero + Stats (the first-impression pair)
3. Experience timeline (structural rebuild)
4. Projects gallery (featured layout + tilt/spotlight)
5. About scroll-scrub
6. Tools / Skills / Certifications / Education identities
7. Contact finale
8. QA gate (budget above)

**Phase 2 (needs approval + content, separate effort):** in-site case study pages —
sticky-scroll Problem → Research → Strategy → Execution → Results scenes with animated
metrics, fed by a `caseStudy` schema extension and edited in the studio like everything else.
