import { isAddress } from "viem";
import type { MemePageDraft } from "@/types";

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const RESERVED = new Set(["www", "app", "api", "admin", "builder", "feed", "p", "static"]);
export const MAX_IMAGE_CHARS = 400_000; // ~300 KB as base64
/** Uploaded gallery images are smaller so 12 of them fit in one request (Vercel caps bodies at 4.5 MB). */
export const MAX_GALLERY_CHARS = 200_000; // ~150 KB as base64
export const MAX_TEXT = 2000;

export const isSafeUrl = (u: string) => {
  try {
    const p = new URL(u).protocol;
    return p === "https:" || p === "http:";
  } catch {
    return false;
  }
};

const isImage = (u: string) => (u.startsWith("data:image/") && u.length <= MAX_IMAGE_CHARS) || (u.startsWith("https://") && isSafeUrl(u));

/** Shared by the builder (UX) and the API (security). Returns a list of human-readable errors. */
export function validateDraft(d: MemePageDraft): string[] {
  const e: string[] = [];
  if (!SLUG_RE.test(d.slug) || RESERVED.has(d.slug)) e.push("Page address must be 3-32 characters: a-z, 0-9 and dashes.");
  if (!d.tokenName.trim() || d.tokenName.length > 40) e.push("Token name is required (max 40 characters).");
  if (!/^[A-Za-z0-9]{1,12}$/.test(d.ticker)) e.push("Ticker must be 1-12 letters or numbers.");
  if (d.tagline.length > 140) e.push("Tagline is too long (max 140).");
  if (d.contractAddress && !isAddress(d.contractAddress)) e.push("Contract address is not a valid EVM address.");
  if (d.logoUrl && !isImage(d.logoUrl)) e.push("Logo must be an uploaded image under 300 KB or an https link.");
  if (d.bannerUrl && !isImage(d.bannerUrl)) e.push("Banner must be an uploaded image under 300 KB or an https link.");
  for (const c of Object.values(d.theme)) if (!HEX_COLOR.test(c)) e.push("Colors must be hex values like #FF3EA5.");
  for (const u of Object.values(d.socials)) if (u && !isSafeUrl(u)) e.push("Social links must start with https://");
  if (d.links.length > 6 || d.links.some((l) => !l.label.trim() || !isSafeUrl(l.url))) e.push("Custom links need a label and an https URL (max 6).");
  if (d.roadmap.length > 8) e.push("Roadmap supports up to 8 steps.");
  const okGallery = (u: string) => (u.startsWith("data:image/") && u.length <= MAX_GALLERY_CHARS) || (u.startsWith("https://") && isSafeUrl(u));
  if (d.gallery.length > 12 || !d.gallery.every(okGallery)) e.push("Gallery supports up to 12 images (uploads or https links).");
  const lp = d.launchpad;
  if (lp && (lp.name.length > 40 || (lp.url && !isSafeUrl(lp.url)))) e.push("Platform link must start with https:// (name max 40).");
  if ((d.textBefore ?? "").length > MAX_TEXT || (d.textAfter ?? "").length > MAX_TEXT) e.push(`Text blocks are limited to ${MAX_TEXT} characters each.`);
  return Array.from(new Set(e));
}
