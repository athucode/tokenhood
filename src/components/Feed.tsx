"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { motion } from "framer-motion";
import { sortPages } from "@/lib/feed";
import { SEED_PAGES } from "@/lib/seed";
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

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((j) => setRemote(j.pages ?? []))
      .catch(() => setRemote([]));
  }, []);

  // Respect shown = stored score + this visitor's own vote.
  const pages = useMemo(() => {
    const all = [...remote, ...SEED_PAGES.filter((s) => !remote.some((r) => r.slug === s.slug))].map((p) => ({ ...p, respect: p.respect + (votes[p.slug] ?? 0) }));
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
      <ul className="space-y-3">
        {pages.map((p) => (
          <motion.li key={p.slug} layout transition={{ type: "spring", stiffness: 500, damping: 40 }} className="card flex items-stretch">
            <div className="flex w-14 flex-col items-center justify-center border-r-2 border-curb">
              <button aria-label={`Give respect to ${p.tokenName}`} aria-pressed={votes[p.slug] === 1} onClick={() => vote(p.slug, 1)} className={votes[p.slug] === 1 ? "text-spray" : "text-chalk/60 hover:text-chalk"}><ArrowBigUp /></button>
              <span className="font-display text-lg">{p.respect}</span>
              <button aria-label={`Take respect from ${p.tokenName}`} aria-pressed={votes[p.slug] === -1} onClick={() => vote(p.slug, -1)} className={votes[p.slug] === -1 ? "text-tag" : "text-chalk/60 hover:text-chalk"}><ArrowBigDown /></button>
            </div>
            <Link href={`/${p.slug}`} className="flex flex-1 items-center gap-3 p-3 hover:bg-curb/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 font-display" style={{ background: p.theme.surface, borderColor: p.theme.accent, color: p.theme.text }}>
                {p.logoUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.logoUrl} alt="" className="h-full w-full object-cover" /> : p.ticker.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.tokenName} <span className="text-spray">${p.ticker.toUpperCase()}</span></p>
                <p className="truncate text-sm text-chalk/60">{p.tagline}</p>
                <p className="text-xs text-chalk/40">{getTemplate(p.templateId)?.name}</p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
