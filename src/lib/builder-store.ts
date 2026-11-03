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
  chain: "robinhood",
  logoUrl: "",
  bannerUrl: "",
  theme: DEFAULT_TEMPLATE.defaultTheme,
  socials: { telegram: "", twitter: "", discord: "", website: "" },
  links: [],
  tokenomics: { totalSupply: "1,000,000,000" },
  roadmap: ["Launch", "Raid the timeline", "List on a tracker"],
  gallery: [],
  textBefore: "",
  textAfter: "",
  launchpad: { name: "", url: "" },
});

interface BuilderState {
  draft: MemePageDraft;
  /** Slug of the published page being edited, or null when creating a new one. */
  editing: string | null;
  load: (draft: MemePageDraft, slug: string) => void;
  patch: (p: Partial<MemePageDraft>) => void;
  setTheme: (p: Partial<Theme>) => void;
  setTemplate: (id: string) => void;
  reset: () => void;
}

export const useBuilder = create<BuilderState>((set) => ({
  draft: emptyDraft(),
  editing: null,
  load: (draft, slug) => set({ draft: { ...emptyDraft(), ...draft }, editing: slug }),
  patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  setTheme: (p) => set((s) => ({ draft: { ...s.draft, theme: { ...s.draft.theme, ...p } } })),
  // Template = layout only; the chosen color set stays.
  setTemplate: (id) => set((s) => ({ draft: { ...s.draft, templateId: getTemplate(id) ? id : s.draft.templateId } })),
  reset: () => set({ draft: emptyDraft(), editing: null }),
}));
