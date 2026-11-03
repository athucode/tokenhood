import { getPageBySlug } from "./db";
import { HOOD_INFO } from "./hood-info";

/** Slug of the Tokenhood page that describes $HOOD itself. Its data drives the homepage and footer. */
export const HOOD_PAGE_SLUG = "hood";

export type HoodInfo = {
  name: string;
  symbol: string;
  contractAddress: string;
  chainName: string;
  deployer: { name: string; url: string };
  x: { handle: string; url: string };
  telegram: string;
  /** Path of the $HOOD page when it exists, e.g. "/hood". */
  pagePath: string | null;
  isLive: boolean;
};

const isCA = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

const handleFromUrl = (u: string) => {
  try {
    const seg = new URL(u).pathname.split("/").filter(Boolean)[0];
    return seg ? `@${seg}` : u;
  } catch {
    return u;
  }
};

/**
 * $HOOD info for display: values from the /hood page when it exists (edit that page to update
 * the homepage), falling back field by field to lib/hood-info.ts.
 */
export async function getHoodInfo(): Promise<HoodInfo> {
  const base: HoodInfo = { ...HOOD_INFO, pagePath: null, isLive: isCA(HOOD_INFO.contractAddress) };
  try {
    const p = await getPageBySlug(HOOD_PAGE_SLUG);
    if (!p) return base;
    const ca = p.contractAddress || base.contractAddress;
    return {
      ...base,
      name: p.tokenName || base.name,
      symbol: (p.ticker || base.symbol).toUpperCase(),
      contractAddress: ca,
      deployer: p.launchpad?.name || p.launchpad?.url ? { name: p.launchpad.name || p.launchpad.url, url: p.launchpad.url } : base.deployer,
      x: p.socials.twitter ? { handle: handleFromUrl(p.socials.twitter), url: p.socials.twitter } : base.x,
      telegram: p.socials.telegram || base.telegram,
      pagePath: `/${HOOD_PAGE_SLUG}`,
      isLive: isCA(ca),
    };
  } catch {
    return base;
  }
}
