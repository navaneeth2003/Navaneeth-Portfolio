export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  bg: string;
  bgAlt: string;
  card: string;
  border: string;
  textMute: string;
  textSub: string;
  accent: string;
  accentGlow: string;
  glowRgb: string;
  meltTint: string;
  swatches: string[];
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default",
    name: "Ember Obsidian",
    description: "Original iconic portfolio identity with incandescent fiery orange accents and warm obsidian carbon tones.",
    bg: "#09090b",
    bgAlt: "#131313",
    card: "#161616",
    border: "rgba(255, 255, 255, 0.09)",
    textMute: "rgba(255, 255, 255, 0.62)",
    textSub: "rgba(255, 255, 255, 0.82)",
    accent: "#ff4a1a",
    accentGlow: "#ff5a1a",
    glowRgb: "255, 74, 26",
    meltTint: "#3a0f06",
    swatches: ["#09090b", "#161616", "#ff4a1a", "#ffffff"],
  },
  {
    id: "graphite",
    name: "Graphite Minimal",
    description: "High-contrast monochrome editorial style with icy platinum highlights and cool titanium surfaces.",
    bg: "#0a0b0d",
    bgAlt: "#14161a",
    card: "#181b20",
    border: "rgba(255, 255, 255, 0.12)",
    textMute: "rgba(255, 255, 255, 0.65)",
    textSub: "rgba(255, 255, 255, 0.88)",
    accent: "#f1f5f9",
    accentGlow: "#94a3b8",
    glowRgb: "241, 245, 249",
    meltTint: "#181f2a",
    swatches: ["#0a0b0d", "#181b20", "#f1f5f9", "#94a3b8"],
  },
  {
    id: "midnight",
    name: "Midnight Azure",
    description: "Deep nocturnal abyssal blue with electric cyan neon accents and sleek atmospheric depth.",
    bg: "#040711",
    bgAlt: "#0b1021",
    card: "#0f172a",
    border: "rgba(56, 189, 248, 0.14)",
    textMute: "rgba(224, 242, 254, 0.62)",
    textSub: "rgba(224, 242, 254, 0.84)",
    accent: "#38bdf8",
    accentGlow: "#0284c7",
    glowRgb: "56, 189, 248",
    meltTint: "#061d36",
    swatches: ["#040711", "#0f172a", "#38bdf8", "#7dd3fc"],
  },
  {
    id: "emerald",
    name: "Emerald Spruce",
    description: "Luxurious deep boreal evergreen background with vivid mint-emerald luminescence.",
    bg: "#040d08",
    bgAlt: "#08170f",
    card: "#0d2217",
    border: "rgba(52, 211, 153, 0.14)",
    textMute: "rgba(209, 250, 229, 0.62)",
    textSub: "rgba(209, 250, 229, 0.84)",
    accent: "#10b981",
    accentGlow: "#059669",
    glowRgb: "16, 185, 129",
    meltTint: "#062819",
    swatches: ["#040d08", "#0d2217", "#10b981", "#34d399"],
  },
  {
    id: "warm-clay",
    name: "Warm Clay & Sand",
    description: "Architectural earthy terracotta with rich dark umber surfaces and amber gold warmth.",
    bg: "#0d0a08",
    bgAlt: "#17120e",
    card: "#1f1914",
    border: "rgba(251, 191, 36, 0.12)",
    textMute: "rgba(254, 243, 199, 0.60)",
    textSub: "rgba(254, 243, 199, 0.82)",
    accent: "#f59e0b",
    accentGlow: "#d97706",
    glowRgb: "245, 158, 11",
    meltTint: "#331b0c",
    swatches: ["#0d0a08", "#1f1914", "#f59e0b", "#fbbf24"],
  },
  {
    id: "editorial-crimson",
    name: "Editorial Crimson",
    description: "Haute-couture dark velvet noir with rich carmine ruby accents and theatrical elegance.",
    bg: "#0a0607",
    bgAlt: "#150c0e",
    card: "#1c1013",
    border: "rgba(244, 63, 94, 0.14)",
    textMute: "rgba(255, 228, 230, 0.60)",
    textSub: "rgba(255, 228, 230, 0.82)",
    accent: "#f43f5e",
    accentGlow: "#e11d48",
    glowRgb: "244, 63, 94",
    meltTint: "#360a16",
    swatches: ["#0a0607", "#1c1013", "#f43f5e", "#fda4af"],
  },
];

export function getPalette(id?: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) || COLOR_PALETTES[0];
}
