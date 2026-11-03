import type { Theme } from "@/types";

export interface Palette {
  id: string;
  name: string;
  theme: Theme;
}

const p = (id: string, name: string, background: string, surface: string, text: string, accent: string, accent2: string): Palette => ({
  id,
  name,
  theme: { background, surface, text, accent, accent2 },
});

/** Curated color sets for token sites. accent = main brand color, accent2 = highlight. */
export const PALETTES: Palette[] = [
  p("hood-classic", "Hood Classic", "#17181C", "#24262C", "#F1EEE4", "#FF3EA5", "#3DE3FF"),
  p("midnight-mint", "Midnight Mint", "#0E1A1F", "#152830", "#E8F3EF", "#5EF2B8", "#F2C14E"),
  p("sunset-drive", "Sunset Drive", "#1E1033", "#2C1849", "#FCEFE6", "#FF7A59", "#FFC857"),
  p("neon-arcade", "Neon Arcade", "#120B1F", "#1F1535", "#F3EDFF", "#B26BFF", "#3DF2E0"),
  p("ocean-floor", "Ocean Floor", "#071C2C", "#0D2B42", "#E4F1FA", "#3FB6E8", "#F7B267"),
  p("lava", "Lava", "#1A0D0A", "#2B1611", "#FBEDE6", "#FF5A1F", "#FFD166"),
  p("golden-hour", "Golden Hour", "#2A1E12", "#3A2A19", "#FFF3DC", "#F5B83D", "#E86A4A"),
  p("forest-night", "Forest Night", "#0F1E17", "#183026", "#E9F4EC", "#7BD389", "#F0B86E"),
  p("rose-noir", "Rose Noir", "#2B1A1F", "#3B252C", "#FCEEF0", "#F4A3B4", "#E9C28B"),
  p("steel-blue", "Steel Blue", "#1A2230", "#243046", "#E6ECF5", "#7FA7FF", "#FFB86B"),
  p("cyber-lime", "Cyber Lime", "#0D0F0A", "#1A1E13", "#F0F5E1", "#C6F432", "#7CD6FF"),
  p("bubblegum", "Bubblegum", "#FFE9F1", "#FFFFFF", "#2A1630", "#B81F62", "#6B4BFF"),
  p("ice-pop", "Ice Pop", "#E6F6FF", "#FFFFFF", "#0F2740", "#0B6FB0", "#E8457A"),
  p("lime-lab", "Lime Lab", "#F1F6E4", "#FFFFFF", "#1B2410", "#3F7A0C", "#D9621F"),
  p("matcha", "Matcha", "#E5EEE1", "#F7FAF5", "#1F2E22", "#2F6B40", "#B97A1C"),
  p("grape-soda", "Grape Soda", "#F1E9FF", "#FFFFFF", "#24133D", "#6E2FD6", "#B85F05"),
  p("coral-reef", "Coral Reef", "#FFF0EA", "#FFFFFF", "#2B1A16", "#B83623", "#17807F"),
  p("cool-paper", "Cool Paper", "#ECEFF4", "#FFFFFF", "#17202B", "#2F5BEA", "#E8503D"),
  p("banana", "Banana", "#FFE45C", "#FFF7CC", "#211C08", "#211C08", "#D4246A"),
  p("mono-ink", "Mono Ink", "#F2F2F2", "#FFFFFF", "#141414", "#141414", "#E03A1C"),
];

export const getPalette = (id: string) => PALETTES.find((x) => x.id === id);

/** Palette whose colors match the theme exactly (for highlighting the selected swatch). */
export const findPalette = (t: Theme) =>
  PALETTES.find((x) => (Object.keys(t) as (keyof Theme)[]).every((k) => x.theme[k].toLowerCase() === t[k].toLowerCase()));

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
/** Readable text color to put on top of `bg`: whichever of the theme's text/background contrasts more. */
export const onColor = (bg: string, t: Theme) => (contrast(bg, t.text) >= contrast(bg, t.background) ? t.text : t.background);
