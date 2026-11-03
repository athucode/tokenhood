import type { MemePage } from "@/types";

/**
 * Storage adapter. Uses Supabase (REST) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set,
 * otherwise an in-memory Map so the app runs locally. In-memory data is NOT persistent on Vercel.
 */
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SB_URL && SB_KEY);

const g = globalThis as unknown as { __hoodMem?: Map<string, MemePage> };
const mem = (g.__hoodMem ??= new Map<string, MemePage>());

async function sb(path: string, init?: RequestInit) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SB_KEY!,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

type Row = { id: string; slug: string; tx_hash: string; owner: string; data: MemePage; respect: number; created_at: string };
const fromRow = (r: Row): MemePage => ({ ...r.data, id: r.id, respect: r.respect, createdAt: r.created_at });

export async function listPages(): Promise<MemePage[]> {
  if (!useSupabase) return [...mem.values()];
  const rows: Row[] = await sb("meme_pages?select=*&order=created_at.desc&limit=200");
  return rows.map(fromRow);
}

export async function getPageBySlug(slug: string): Promise<MemePage | null> {
  if (!useSupabase) return mem.get(slug) ?? null;
  const rows: Row[] = await sb(`meme_pages?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function isTxUsed(txHash: string): Promise<boolean> {
  const hash = txHash.toLowerCase();
  if (!useSupabase) return [...mem.values()].some((p) => p.paymentTxHash.toLowerCase() === hash);
  const rows: Row[] = await sb(`meme_pages?select=id&tx_hash=eq.${hash}&limit=1`);
  return rows.length > 0;
}

export async function listPagesByOwner(owner: string): Promise<MemePage[]> {
  const o = owner.toLowerCase();
  if (!useSupabase) return [...mem.values()].filter((p) => p.owner.toLowerCase() === o);
  const rows: Row[] = await sb(`meme_pages?select=*&owner=ilike.${encodeURIComponent(o)}&order=created_at.desc&limit=100`);
  return rows.map(fromRow);
}

/** Replaces a page's content (slug, owner, payment and score stay as stored). */
export async function updatePage(page: MemePage): Promise<MemePage> {
  if (!useSupabase) {
    mem.set(page.slug, page);
    return page;
  }
  const [row]: Row[] = await sb(`meme_pages?slug=eq.${encodeURIComponent(page.slug)}`, {
    method: "PATCH",
    body: JSON.stringify({ data: page }),
  });
  if (!row) throw new Error("Page not found.");
  return fromRow(row);
}

export async function deletePage(slug: string): Promise<boolean> {
  if (!useSupabase) return mem.delete(slug);
  const rows: Row[] = await sb(`meme_pages?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE" });
  return rows.length > 0;
}

export async function insertPage(page: MemePage): Promise<MemePage> {
  if (!useSupabase) {
    mem.set(page.slug, page);
    return page;
  }
  const [row]: Row[] = await sb("meme_pages", {
    method: "POST",
    body: JSON.stringify({ slug: page.slug, tx_hash: page.paymentTxHash.toLowerCase(), owner: page.owner, data: page, respect: 0 }),
  });
  return fromRow(row);
}
