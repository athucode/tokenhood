"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { editMessage } from "@/lib/hood";
import { validateDraft } from "@/lib/validate";
import type { MemePageDraft } from "@/types";

/** Save changes to a published page. The server checks the signer is the page owner (or an admin). */
export function EditPanel({ draft, slug }: { draft: MemePageDraft; slug: string }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const problems = validateDraft({ ...draft, slug });

  async function save() {
    if (!address) return;
    setSaving(true);
    setError(null);
    try {
      const ts = Date.now();
      const signature = await signMessageAsync({ message: editMessage(slug, ts) });
      const res = await fetch(`/api/pages/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, editor: address, signature, ts }),
      });
      const text = await res.text();
      let json: { error?: string } = {};
      try { json = JSON.parse(text); } catch { /* non-JSON body */ }
      if (!res.ok) throw new Error(json.error ?? `Save failed (HTTP ${res.status}).`);
      router.push(`/${slug}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl">Save changes</h2>
        <p className="font-semibold text-tag">Free</p>
      </div>
      {problems.length > 0 && <ul className="list-disc space-y-1 pl-5 text-sm text-caution">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
      {!isConnected ? (
        <ConnectButton label="Connect the wallet that created this page" />
      ) : (
        <button className="btn-primary w-full" disabled={saving || problems.length > 0} onClick={save}>
          {saving ? <><Loader2 className="animate-spin" size={18} /> Saving</> : "Sign and save"}
        </button>
      )}
      {error && <p className="text-sm text-spray">{error}</p>}
    </div>
  );
}
