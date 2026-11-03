import { create } from "zustand";
import { DEFAULT_TEMPLATE, getTemplate } from "./templates";
import type { MemePageDraft, Theme } from "@/types";

const emptyDraft = (): MemePageDraft => ({
  slug: "",
  templateId: DEFAULT_TEMPLATE.id,
  tokenName: "",
  ticker: "",
  tagline: "",
  contractAddress: "",
  chain: "base",
  logoUrl: "",
  bannerUrl: "",
  theme: DEFAULT_TEMPLATE.defaultTheme,
  socials: { telegram: "", twitter: "", discord: "", website: "" },
  links: [],
  tokenomics: { totalSupply: "1,000,000,000", buyTax: "0%", sellTax: "0%" },
  roadmap: ["Launch", "Raid the timeline", "List on a tracker"],
  gallery: [],
});

interface BuilderState {
  draft: MemePageDraft;
  patch: (p: Partial<MemePageDraft>) => void;
  setTheme: (p: Partial<Theme>) => void;
  setTemplate: (id: string) => void;
  reset: () => void;
}

export const useBuilder = create<BuilderState>((set) => ({
  draft: emptyDraft(),
  patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  setTheme: (p) => set((s) => ({ draft: { ...s.draft, theme: { ...s.draft.theme, ...p } } })),
  // Switching template also loads that template's default colors.
  setTemplate: (id) => set((s) => ({ draft: { ...s.draft, templateId: id, theme: getTemplate(id)?.defaultTheme ?? s.draft.theme } })),
  reset: () => set({ draft: emptyDraft() }),
}));
