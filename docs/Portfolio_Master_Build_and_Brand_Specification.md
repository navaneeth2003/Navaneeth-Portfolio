# Portfolio Website + Content Studio — Master Build & Brand Specification

> This document combines the original build specification with an expanded visual design system and implementation guidance.

> NOTE:
> The original specification provided by the user remains the source of truth for architecture, CMS behavior, schemas, publishing workflow and functionality. This appendix defines the visual language.

---

# PART 1 — Original Build Specification

Include the entire original specification provided by the user here without modification.
(When using this file, append or merge the user's original markdown document `navaneeth-portfolio-build-spec.md` before this appendix.)

---

# PART 2 — Brand Canvas & Design System

## Design Philosophy

The UI should feel like a product built by Apple, Linear, Notion, Arc, Raycast or Vercel.

The interface itself should communicate product thinking.

Minimal.
Intentional.
Timeless.

Never trendy.

## Visual Language

- Flat 2D design
- Bento grid layout
- Large rounded cards
- Soft neutral background
- Minimal shadows
- Thin borders
- Typography-first hierarchy
- One accent color only
- No decorative gradients
- No glassmorphism except extremely subtle overlays if absolutely necessary.

## Color Tokens

```css
:root{
  --bg:#FAFAF8;
  --surface:#FFFFFF;
  --text:#0B0D10;
  --muted:#687280;
  --border:#E5E7EB;
  --accent:#2563EB;
  --success:#22C55E;
  --warning:#F59E0B;
  --danger:#EF4444;
}
```

## Typography

Primary: Plus Jakarta Sans

Fallback:
Inter, system-ui, sans-serif

```css
body{
 font-family:"Plus Jakarta Sans",Inter,system-ui,sans-serif;
 background:#FAFAF8;
 color:#0B0D10;
}
```

## Card Style

```css
.card{
background:#fff;
border:1px solid #ECECEC;
border-radius:24px;
padding:32px;
box-shadow:0 8px 30px rgba(0,0,0,.04);
}
```

## Buttons

```css
.btn-primary{
background:#0B0D10;
color:white;
border-radius:14px;
padding:14px 22px;
}
```

## 8pt Spacing Scale

8,16,24,32,40,48,64,80,96,128

## Border Radius

Cards 24px

Inputs 12px

Buttons 14px

Tags 999px

## Icons

Lucide Icons

Outline only

2px stroke

## Motion

200ms ease-out

Opacity

Small translateY

No bounce

## Principles

- Clarity over decoration
- Typography over effects
- Content first
- Consistency everywhere
- Whitespace is a feature

## Avoid

- Heavy gradients
- Neon colors
- Floating blobs
- Glassmorphism-heavy UI
- Oversized shadows
- Busy backgrounds
- Random radii
- Inconsistent spacing

## Final Experience

The user should notice the content first.

The interface should disappear.

It should feel premium without trying to look expensive.

