"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAccount } from "wagmi";
import { isAdmin } from "@/lib/hood";

/** Floating edit link, only visible to the page owner (or an admin) whose wallet is connected. */
export function OwnerEditButton({ slug, owner }: { slug: string; owner: string }) {
  const { address } = useAccount();
  if (!address || (address.toLowerCase() !== owner.toLowerCase() && !isAdmin(address))) return null;
  return (
    <Link href={`/builder?edit=${slug}`} className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 border-2 border-chalk bg-asphalt px-4 py-2 text-sm font-semibold text-chalk shadow-blockTag">
      <Pencil size={16} /> Edit page
    </Link>
  );
}
