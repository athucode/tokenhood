import type { Template, Theme } from "@/types";

const streetTheme: Theme = { background: "#17181C", surface: "#25272D", text: "#F1EEE4", accent: "#FF3EA5", accent2: "#3DE3FF" };
const cautionTheme: Theme = { background: "#FFD21F", surface: "#FFFFFF", text: "#17181C", accent: "#17181C", accent2: "#FF3EA5" };
const wallTheme: Theme = { background: "#0F2A24", surface: "#17403A", text: "#F1EEE4", accent: "#B6FF3D", accent2: "#FF8A3D" };

export const TEMPLATES: Template[] = [
  {
    id: "street-tag",
    name: "Street Tag",
    tagline: "One screen: logo, buy button, socials. Fast and cheap.",
    sections: ["hero", "buy", "socials"],
    priceHood: 500,
    defaultTheme: streetTheme,
  },
  {
    id: "full-block",
    name: "Full Block",
    tagline: "Everything a token needs: tokenomics, roadmap, buy widget, socials.",
    sections: ["hero", "buy", "tokenomics", "roadmap", "socials"],
    priceHood: 1500,
    defaultTheme: cautionTheme,
  },
  {
    id: "gallery-wall",
    name: "Gallery Wall",
    tagline: "Meme-first. A wall of your best images with socials underneath.",
    sections: ["hero", "gallery", "socials"],
    priceHood: 800,
    defaultTheme: wallTheme,
  },
];

export const getTemplate = (id: string): Template | undefined => TEMPLATES.find((t) => t.id === id);

export const DEFAULT_TEMPLATE = TEMPLATES[0];
