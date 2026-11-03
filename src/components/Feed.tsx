"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowBigDown, ArrowBigUp, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAccount, useSignMessage } from "wagmi";
import { deleteMessage, isAdmin } from "@/lib/hood";
import { motion } from "framer-motion";
import { sortPages } from "@/lib/feed";
import { useRespect } from "@/lib/respect-store";
import { getTemplate } from "@/lib/templates";
import type { FeedFilter, MemePage } from "@/types";

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "hot", label: "Hot" },
  { id: "latest", label: "Latest" },
  { id: "top", label: "Top Hoods" },
];

export function Feed({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<FeedFilter>("hot");
  const [remote, setRemote] = useState<MemePage[]>([]);
  const { votes, vote } = useRespect();
  const { address } = useAccount();
  const admin = isAdmin(address);
  const { signMessageAsync } = useSignMessage();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  async function remove(slug: string) {
    if (!address || !window.confirm(`Delete /${slug}? This cannot be undone.`)) return;
    setDeleting(slug);
    setAdminError(null);
    try {
      const ts = Date.now();
      const signature = await signMessageAsync({ message: deleteMessage(slug, ts) });
      const res = await fetch(`/api/pages/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: address, signature, ts }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? `Delete failed (HTTP ${res.status}).`);
      setRemote((r) => r.filter((p) => p.slug !== slug));
    } catch (e) {
      setAdminError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((j) => setRemote(j.pages ?? []))
      .catch(() => setRemote([]));
  }, []);

  // Respect shown = stored score + this visitor's own vote.
  const pages = useMemo(() => {
    const all = remote.map((p) => ({ ...p, respect: p.respect + (votes[p.slug] ?? 0) }));
    const sorted = sortPages(all, filter);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [remote, filter, votes, limit]);

  return (
    <div>
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Feed filter">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={`btn ${filter === f.id ? "bg-chalk text-asphalt" : ""}`}>{f.label}</button>
        ))}
      </div>
      {adminError && <p className="mb-3 text-sm text-spray">{adminError}</p>}
      {pages.length === 0 && <p className="card p-6 text-center text-chalk/60">No pages yet. Be the first to build one.</p>}
      <ul className="space-y-3">
        {pages.map((p) => (
          <motion.li key={p.slug} layout transition={{ type: "spring", stiffness: 500, damping: 40 }} className="card flex items-stretch">
            <div className="flex w-14 flex-col items-center justify-center border-r-2 border-curb">
              <button aria-label={`Give respect to ${p.tokenName}`} aria-pressed={votes[p.slug] === 1} onClick={() => vote(p.slug, 1)} className={votes[p.slug] === 1 ? "text-spray" : "text-chalk/60 hover:text-chalk"}><ArrowBigUp /></button>
              <span className="font-display text-lg">{p.respect}</span>
              <button aria-label={`Take respect from ${p.tokenName}`} aria-pressed={votes[p.slug] === -1} onClick={() => vote(p.slug, -1)} className={votes[p.slug] === -1 ? "text-tag" : "text-chalk/60 hover:text-chalk"}><ArrowBigDown /></button>
            </div>
            <Link href={`/${p.slug}`} className="flex flex-1 items-center gap-3 p-3 hover:bg-curb/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 font-display" style={{ background: p.theme.surface, borderColor: p.theme.accent, color: p.theme.text }}>
                {p.logoUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.logoUrl} alt="" className="h-full w-full object-cover" /> : p.ticker.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.tokenName} <span className="text-spray">${p.ticker.toUpperCase()}</span></p>
                <p className="truncate text-sm text-chalk/60">{p.tagline}</p>
                <p className="text-xs text-chalk/40">{getTemplate(p.templateId)?.name}</p>
              </div>
            </Link>
            {admin && (
              <div className="flex flex-col border-l-2 border-curb">
                <Link href={`/builder?edit=${p.slug}`} aria-label={`Edit ${p.tokenName}`} className="flex flex-1 items-center px-3 text-chalk/70 hover:text-tag"><Pencil size={16} /></Link>
                <button type="button" aria-label={`Delete ${p.tokenName}`} disabled={deleting === p.slug} onClick={() => remove(p.slug)} className="flex flex-1 items-center border-t-2 border-curb px-3 text-chalk/70 hover:text-spray disabled:opacity-50">
                  {deleting === p.slug ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
