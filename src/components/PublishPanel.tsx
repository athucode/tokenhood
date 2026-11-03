"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useHoodPayment } from "@/hooks/useHoodPayment";
import { adminPublishMessage, isAdmin, publishMessage } from "@/lib/hood";
import { getTemplate } from "@/lib/templates";
import { validateDraft } from "@/lib/validate";
import type { MemePageDraft } from "@/types";

/** Checkout: pay in $HOOD -> sign ownership message -> server verifies and publishes. */
export function PublishPanel({ draft }: { draft: MemePageDraft }) {
  const router = useRouter();
  const template = getTemplate(draft.templateId)!;
  const pay = useHoodPayment(template.priceHood);
  const { signMessageAsync } = useSignMessage();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const problems = validateDraft(draft);
  const admin = isAdmin(pay.payer);

  async function submit(body: object) {
    const res = await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Publish failed.");
    router.push(`/${json.page.slug}`);
  }

  async function publishAdmin() {
    if (!pay.payer) return;
    setPublishing(true);
    setError(null);
    try {
      const adminTs = Date.now();
      const signature = await signMessageAsync({ message: adminPublishMessage(draft.slug, adminTs) });
      await submit({ draft, payer: pay.payer, signature, adminTs });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
      setPublishing(false);
    }
  }

  async function publish() {
    if (!pay.txHash || !pay.payer) return;
    setPublishing(true);
    setError(null);
    try {
      const signature = await signMessageAsync({ message: publishMessage(draft.slug, pay.txHash) });
      await submit({ draft, txHash: pay.txHash, payer: pay.payer, signature });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
      setPublishing(false);
    }
  }

  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl">Publish</h2>
        <p className="text-caution font-semibold">{admin ? <><s className="opacity-50">{template.priceHood.toLocaleString()}</s> Free (admin)</> : `${template.priceHood.toLocaleString()} $HOOD`}</p>
      </div>

      {!pay.isConfigured && !admin && (
        <p className="flex gap-2 border-2 border-caution p-2 text-sm text-caution">
          <AlertTriangle size={18} className="shrink-0" /> Set NEXT_PUBLIC_HOOD_TOKEN_ADDRESS and NEXT_PUBLIC_TREASURY_ADDRESS to enable payments.
        </p>
      )}

      {problems.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-caution">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
      )}

      {!pay.isConnected ? (
        <ConnectButton label="Connect wallet to pay" />
      ) : admin ? (
        <>
          <button className="btn-primary w-full" disabled={publishing || problems.length > 0} onClick={publishAdmin}>
            {publishing ? <><Loader2 className="animate-spin" size={18} /> Publishing</> : "Sign and publish free"}
          </button>
          {error && <p className="text-sm text-spray">{error}</p>}
        </>
      ) : (
        <>
          {pay.balanceFormatted !== undefined && (
            <p className="text-sm text-chalk/70">Your balance: {Number(pay.balanceFormatted).toLocaleString()} $HOOD</p>
          )}
          {pay.hasEnough === false && <p className="text-sm text-caution">Not enough $HOOD to pay this fee.</p>}

          {pay.status !== "success" && (
            <button className="btn-primary w-full" disabled={!pay.isConfigured || problems.length > 0 || pay.hasEnough === false || pay.status === "awaiting_signature" || pay.status === "pending"} onClick={pay.pay}>
              {pay.status === "awaiting_signature" && <><Loader2 className="animate-spin" size={18} /> Confirm in wallet</>}
              {pay.status === "pending" && <><Loader2 className="animate-spin" size={18} /> Waiting for confirmation</>}
              {(pay.status === "idle" || pay.status === "failed") && `Pay ${template.priceHood.toLocaleString()} $HOOD`}
            </button>
          )}

          {pay.status === "failed" && <p className="text-sm text-spray">Payment failed: {pay.errorMessage}</p>}

          {pay.status === "success" && (
            <>
              <p className="flex items-center gap-2 text-sm text-tag"><CheckCircle2 size={18} /> Payment confirmed.</p>
              <button className="btn-primary w-full" disabled={publishing || problems.length > 0} onClick={publish}>
                {publishing ? <><Loader2 className="animate-spin" size={18} /> Publishing</> : "Sign and publish"}
              </button>
            </>
          )}
          {error && <p className="text-sm text-spray">{error}</p>}
        </>
      )}
    </div>
  );
}
