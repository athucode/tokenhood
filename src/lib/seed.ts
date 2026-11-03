import { DEFAULT_TEMPLATE, TEMPLATES } from "./templates";
import type { Hex, MemePage } from "@/types";

const ZERO = "0x0000000000000000000000000000000000000000" as Hex;
const ago = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

const mk = (i: number, slug: string, name: string, ticker: string, tagline: string, respect: number, hoursAgo: number, tpl = i % TEMPLATES.length): MemePage => ({
  id: `seed-${slug}`,
  slug,
  templateId: TEMPLATES[tpl].id,
  tokenName: name,
  ticker,
  tagline,
  contractAddress: "",
  chain: "base",
  logoUrl: "",
  bannerUrl: "",
  theme: TEMPLATES[tpl].defaultTheme,
  socials: { telegram: "", twitter: "", discord: "", website: "" },
  links: [],
  tokenomics: { totalSupply: "1,000,000,000" },
  roadmap: ["Launch the page", "Raid the timeline", "Get on the hood leaderboard"],
  gallery: [],
  owner: ZERO,
  paymentTxHash: ZERO,
  status: "published",
  respect,
  createdAt: ago(hoursAgo),
});

/** Demo content so the feed is never empty. Remove once real pages exist. */
export const SEED_PAGES: MemePage[] = [
  mk(0, "corner-cat", "Corner Cat", "CCAT", "The cat that owns the block.", 128, 3),
  mk(1, "bodega-frog", "Bodega Frog", "BFROG", "Chopped cheese, no slippage.", 342, 20),
  mk(2, "sneaker-dog", "Sneaker Dog", "SDOG", "Walks only in limited drops.", 87, 1),
  mk(3, "block-party", "Block Party", "PARTY", "Everyone is invited. Gas is not.", 410, 70, 1),
];

export { DEFAULT_TEMPLATE };
