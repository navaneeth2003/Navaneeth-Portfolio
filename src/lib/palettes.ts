import type { CSSProperties } from "react";

/**
 * Whole-site themes (Studio → Theme). One click in the studio swaps every
 * colour on the site: canvas, cards, ink, accent, pastel tints and shadows.
 * This file is the single source of truth — the public site applies a
 * theme by writing these values as CSS custom properties on its wrapper
 * (see themeStyle), and the studio's picker draws its previews from the
 * same values. The ids are the original palette ids, so a choice saved
 * before themes existed still resolves.
 */

export type ThemeColors = {
  canvas: string;
  canvasDeep: string;
  card: string;
  well: string;
  hairline: string;
  onyx: string; // ink: headings, body copy, the primary pill
  onOnyx: string; // text that sits on an ink surface
  ash: string;
  dust: string;
  pop: string; // accent fill
  popSoft: string;
  popInk: string; // accent as readable text
  glow: string; // "r, g, b" — the light at the top of the page
  shade: string; // "r g b" — shadow tint
  shadeStrength: string; // shadow alpha multiplier
  highlight: string; // "r g b / a" — the 1px top highlight on cards
  lavender: string;
  butter: string;
  mint: string;
  blush: string;
  sky: string;
  peach: string;
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  colors: ThemeColors;
};

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "Sunny Butter",
    description: "Warm cream paper and a butter-yellow glow. The signature look.",
    mode: "light",
    colors: {
      canvas: "#f5f0e6",
      canvasDeep: "#ede5d6",
      card: "#fffdf8",
      well: "#f4efe4",
      hairline: "rgb(20 18 12 / 0.08)",
      onyx: "#121211",
      onOnyx: "#ffffff",
      ash: "#5b5750",
      dust: "#8c867c",
      pop: "#f5c542",
      popSoft: "#fbedb9",
      popInk: "#8a6100",
      glow: "247, 224, 150",
      shade: "64 48 16",
      shadeStrength: "1",
      highlight: "255 255 255 / 0.9",
      lavender: "#e2e3fc",
      butter: "#fbeaaa",
      mint: "#dcf1d5",
      blush: "#f8dceb",
      sky: "#dcebfb",
      peach: "#fde3d3",
    },
  },
  {
    id: "graphite",
    name: "Lavender Haze",
    description: "A cool lilac canvas with periwinkle light. Calm and dreamy.",
    mode: "light",
    colors: {
      canvas: "#f0eff9",
      canvasDeep: "#e5e3f3",
      card: "#fdfcff",
      well: "#efeef8",
      hairline: "rgb(28 22 72 / 0.09)",
      onyx: "#16142b",
      onOnyx: "#ffffff",
      ash: "#5c5978",
      dust: "#8d8aa8",
      pop: "#8f7cf7",
      popSoft: "#e5e0fd",
      popInk: "#4b3bc4",
      glow: "205, 198, 252",
      shade: "40 30 110",
      shadeStrength: "1",
      highlight: "255 255 255 / 0.9",
      lavender: "#dfddfb",
      butter: "#f3ebcb",
      mint: "#dceee6",
      blush: "#f1dff0",
      sky: "#dde6fb",
      peach: "#f4e3e0",
    },
  },
  {
    id: "emerald",
    name: "Matcha Mint",
    description: "Fresh sage paper with matcha-green accents. Clean and optimistic.",
    mode: "light",
    colors: {
      canvas: "#eef3eb",
      canvasDeep: "#e2eade",
      card: "#fcfefa",
      well: "#edf2ea",
      hairline: "rgb(14 40 24 / 0.09)",
      onyx: "#0f1e16",
      onOnyx: "#ffffff",
      ash: "#52645a",
      dust: "#84958a",
      pop: "#58c285",
      popSoft: "#d3efde",
      popInk: "#1b7343",
      glow: "196, 234, 208",
      shade: "20 60 36",
      shadeStrength: "1",
      highlight: "255 255 255 / 0.9",
      lavender: "#e1e4f8",
      butter: "#f1eec4",
      mint: "#d3edd9",
      blush: "#f1e0e6",
      sky: "#d9eaf2",
      peach: "#f3e6d8",
    },
  },
  {
    id: "warm-clay",
    name: "Peach Fizz",
    description: "Apricot paper and a sunset glow. Warm and juicy.",
    mode: "light",
    colors: {
      canvas: "#fbf0e7",
      canvasDeep: "#f3e1d3",
      card: "#fffcf9",
      well: "#f8ede4",
      hairline: "rgb(60 24 8 / 0.08)",
      onyx: "#22140e",
      onOnyx: "#ffffff",
      ash: "#6e5950",
      dust: "#a08b81",
      pop: "#ff9363",
      popSoft: "#ffe0cf",
      popInk: "#a9441a",
      glow: "255, 210, 184",
      shade: "110 50 20",
      shadeStrength: "1",
      highlight: "255 255 255 / 0.9",
      lavender: "#eae2f6",
      butter: "#fbebb4",
      mint: "#e0f0da",
      blush: "#fadce3",
      sky: "#e0eaf8",
      peach: "#ffdcc9",
    },
  },
  {
    id: "editorial-crimson",
    name: "Bubblegum",
    description: "Blush-pink paper with bubblegum accents. Playful and bright.",
    mode: "light",
    colors: {
      canvas: "#fbeef3",
      canvasDeep: "#f3dee8",
      card: "#fffbfd",
      well: "#f9ecf2",
      hairline: "rgb(70 14 40 / 0.08)",
      onyx: "#23111b",
      onOnyx: "#ffffff",
      ash: "#6d5463",
      dust: "#a28b98",
      pop: "#f27fb2",
      popSoft: "#fcd8e8",
      popInk: "#a82762",
      glow: "250, 200, 226",
      shade: "110 20 60",
      shadeStrength: "1",
      highlight: "255 255 255 / 0.9",
      lavender: "#e7e0fa",
      butter: "#faedc0",
      mint: "#ddf0e2",
      blush: "#f8d6e6",
      sky: "#dfe7fa",
      peach: "#fce1d6",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "A deep ink night with glowing pastel stickers. The dark mode.",
    mode: "dark",
    colors: {
      canvas: "#14151c",
      canvasDeep: "#0f1016",
      card: "#1c1e27",
      well: "#262833",
      hairline: "rgb(255 255 255 / 0.09)",
      onyx: "#f3f0ea",
      onOnyx: "#14151c",
      ash: "#ada9ba",
      dust: "#7c7889",
      pop: "#f6ca57",
      popSoft: "#3a3322",
      popInk: "#f6ca57",
      glow: "72, 64, 142",
      shade: "0 0 0",
      shadeStrength: "2.2",
      highlight: "255 255 255 / 0.05",
      lavender: "#272844",
      butter: "#39331f",
      mint: "#1f3329",
      blush: "#3a2433",
      sky: "#1e2c3e",
      peach: "#3b2a22",
    },
  },
];

export function getTheme(id?: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** The theme as CSS custom properties, for the site wrapper's style attribute. */
export function themeStyle(id?: string): CSSProperties {
  const { colors: c, mode } = getTheme(id);
  return {
    colorScheme: mode,
    "--color-canvas": c.canvas,
    "--color-canvas-deep": c.canvasDeep,
    "--color-card": c.card,
    "--color-well": c.well,
    "--color-hairline": c.hairline,
    "--color-onyx": c.onyx,
    "--color-on-onyx": c.onOnyx,
    "--color-ash": c.ash,
    "--color-dust": c.dust,
    "--color-pop": c.pop,
    "--color-pop-soft": c.popSoft,
    "--color-pop-ink": c.popInk,
    "--glow": c.glow,
    "--shade": c.shade,
    "--shade-k": c.shadeStrength,
    "--highlight": c.highlight,
    "--color-lavender": c.lavender,
    "--color-butter": c.butter,
    "--color-mint": c.mint,
    "--color-blush": c.blush,
    "--color-sky": c.sky,
    "--color-peach": c.peach,
  } as CSSProperties;
}

/* ---------- kept for older studio code paths ---------- */

export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  swatches: string[];
};

export const COLOR_PALETTES: ColorPalette[] = THEMES.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  swatches: [t.colors.canvas, t.colors.pop, t.colors.popSoft, t.colors.onyx],
}));

export function getPalette(id?: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) ?? COLOR_PALETTES[0];
}
