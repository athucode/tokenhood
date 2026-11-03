/** Core domain types for Tokenhood. */

export type Hex = `0x${string}`;

/** Lifecycle of an on-chain $HOOD payment, mirrored in the UI. */
export type PaymentStatus =
  | "idle"
  | "awaiting_signature" // wallet prompt open
  | "pending" // tx broadcast, waiting for confirmation
  | "success"
  | "failed";

export interface Payment {
  id: string;
  txHash: Hex;
  payer: Hex;
  /** Amount in token base units (stringified bigint). */
  amountWei: string;
  status: PaymentStatus;
  pageId?: string;
  createdAt: string;
}

/** Building blocks a template can include. */
export type SectionId = "hero" | "buy" | "tokenomics" | "roadmap" | "gallery" | "socials";

export interface Theme {
  background: string;
  surface: string;
  text: string;
  accent: string;
  accent2: string;
}

export interface Template {
  id: string;
  name: string;
  tagline: string;
  sections: SectionId[];
  /** Fee in whole $HOOD tokens. */
  priceHood: number;
  defaultTheme: Theme;
}

export interface SocialLinks {
  telegram: string;
  twitter: string;
  discord: string;
  website: string;
}

export interface CustomLink {
  label: string;
  url: string;
}

export interface Tokenomics {
  totalSupply: string;
  /** Legacy fields, no longer edited or shown. */
  buyTax?: string;
  sellTax?: string;
}

export interface MemePage {
  id: string;
  slug: string;
  templateId: string;
  tokenName: string;
  ticker: string;
  tagline: string;
  contractAddress: string;
  chain: "base";
  /** https URL or small data: URL. */
  logoUrl: string;
  bannerUrl: string;
  theme: Theme;
  socials: SocialLinks;
  links: CustomLink[];
  tokenomics: Tokenomics;
  roadmap: string[];
  gallery: string[];
  owner: Hex;
  paymentTxHash: Hex;
  status: "draft" | "published";
  /** Net "Hood Respect" score. */
  respect: number;
  createdAt: string;
}

/** What the builder edits before payment. */
export type MemePageDraft = Omit<
  MemePage,
  "id" | "owner" | "paymentTxHash" | "status" | "respect" | "createdAt"
>;

export interface User {
  address: Hex;
  handle?: string;
  joinedAt: string;
  pagesCount: number;
  respectGiven: number;
}

export type FeedFilter = "latest" | "hot" | "top";
