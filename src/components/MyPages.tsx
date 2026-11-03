"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import type { MemePage } from "@/types";

/** Pages created by the connected wallet, each with an edit link. */
export function MyPages() {
  const { address } = useAccount();
  const [pages, setPages] = useState<MemePage[]>([]);

  useEffect(() => {
    if (!address) return setPages([]);
    fetch(`/api/pages?owner=${address}`)
      .then((r) => r.json())
      .then((j) => setPages(j.pages ?? []))
      .catch(() => setPages([]));
  }, [address]);

  if (!pages.length) return null;
  return (
    <div className="card mb-4 p-3">
      <p className="mb-2 text-sm font-semibold">Your pages</p>
      <ul className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <li key={p.slug} className="flex items-center border-2 border-curb text-sm">
            <Link href={`/${p.slug}`} className="px-2 py-1 hover:text-tag">/{p.slug}</Link>
            <Link href={`/builder?edit=${p.slug}`} className="border-l-2 border-curb px-2 py-1 font-semibold text-spray hover:bg-curb/40">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
