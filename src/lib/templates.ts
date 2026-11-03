import type { Template } from "@/types";
import { getPalette } from "./palettes";

/**
 * Templates only change the layout. Every template shows everything the user filled in:
 * token info, buy button, supply, roadmap, texts, gallery and links.
 */
export const TEMPLATES: Template[] = [
  {
    id: "street-tag",
    name: "Street Tag",
    tagline: "Poster layout. Big centered name, token ticket front and center.",
    layout: "poster",
    priceHood: 50_000,
    defaultTheme: getPalette("hood-classic")!.theme,
  },
  {
    id: "full-block",
    name: "Full Block",
    tagline: "Split layout. Story on the left, token ticket on the right.",
    layout: "split",
    priceHood: 50_000,
    defaultTheme: getPalette("banana")!.theme,
  },
  {
    id: "gallery-wall",
    name: "Gallery Wall",
    tagline: "Meme-first. Your images lead, token ticket right after.",
    layout: "gallery",
    priceHood: 50_000,
    defaultTheme: getPalette("forest-night")!.theme,
  },
];

export const getTemplate = (id: string): Template | undefined => TEMPLATES.find((t) => t.id === id);

export const DEFAULT_TEMPLATE = TEMPLATES[0];
