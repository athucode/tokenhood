"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useBuilder } from "@/lib/builder-store";
import { TEMPLATES } from "@/lib/templates";
import { MAX_IMAGE_CHARS } from "@/lib/validate";
import { HOOD_CHAIN, ROOT_DOMAIN } from "@/lib/hood";
import { SitePreview } from "./SitePreview";
import { PublishPanel } from "./PublishPanel";
import type { Theme } from "@/types";

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-1">
    <span className="text-sm font-semibold">{label}</span>
    {children}
  </label>
);

/** Reads an image file into a data URL, rejecting anything over ~300 KB. */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result);
      url.length > MAX_IMAGE_CHARS ? reject(new Error("Image is over 300 KB. Use a smaller file.")) : resolve(url);
    };
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsDataURL(file);
  });
}

export function Builder() {
  const { draft, patch, setTheme, setTemplate } = useBuilder();
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = (key: "logoUrl" | "bannerUrl") => async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await readImage(f);
      patch(key === "logoUrl" ? { logoUrl: url } : { bannerUrl: url });
      setUploadError(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const colorKeys: [keyof Theme, string][] = [["background", "Background"], ["surface", "Cards"], ["text", "Text"], ["accent", "Accent"], ["accent2", "Accent 2"]];

  const form = (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-display text-xl">1. Template</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button key={t.id} type="button" onClick={() => setTemplate(t.id)} aria-pressed={draft.templateId === t.id}
              className={`card p-3 text-left ${draft.templateId === t.id ? "border-spray shadow-block" : "hover:border-tag"}`}>
              <p className="font-display text-lg">{t.name}</p>
              <p className="mt-1 text-xs text-chalk/70">{t.tagline}</p>
              <p className="mt-2 text-sm font-semibold text-caution">{t.priceHood.toLocaleString()} $HOOD</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">2. Token</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Token name"><input className="input" value={draft.tokenName} maxLength={40} onChange={(e) => patch({ tokenName: e.target.value })} placeholder="Corner Cat" /></Field>
          <Field label="Ticker"><input className="input" value={draft.ticker} maxLength={12} onChange={(e) => patch({ ticker: e.target.value.replace(/[^A-Za-z0-9]/g, "") })} placeholder="CCAT" /></Field>
        </div>
        <Field label="Tagline"><input className="input" value={draft.tagline} maxLength={140} onChange={(e) => patch({ tagline: e.target.value })} placeholder="The cat that owns the block." /></Field>
        <Field label={`Contract address (${HOOD_CHAIN.name})`}><input className="input font-mono text-xs" value={draft.contractAddress} onChange={(e) => patch({ contractAddress: e.target.value.trim() })} placeholder="0x..." /></Field>
        <Field label="Page address">
          <div className="flex items-center gap-2">
            <input className="input" value={draft.slug} maxLength={32} onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="corner-cat" />
          </div>
          <span className="text-xs text-chalk/60">{ROOT_DOMAIN}/{draft.slug || "your-name"}</span>
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">3. Look</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["logoUrl", "bannerUrl"] as const).map((k) => (
            <Field key={k} label={k === "logoUrl" ? "Logo (max 300 KB)" : "Banner (max 300 KB)"}>
              <span className="btn cursor-pointer"><Upload size={16} /> {draft[k] ? "Replace image" : "Upload image"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={upload(k)} />
              </span>
            </Field>
          ))}
        </div>
        {uploadError && <p className="text-sm text-spray">{uploadError}</p>}
        <div className="grid grid-cols-5 gap-2">
          {colorKeys.map(([k, label]) => (
            <label key={k} className="space-y-1 text-center text-xs font-semibold">
              {label}
              <input type="color" value={draft.theme[k]} onChange={(e) => setTheme({ [k]: e.target.value } as Partial<Theme>)} className="h-10 w-full cursor-pointer border-2 border-curb bg-transparent" />
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">4. Content</h2>
        <Field label="Total supply">
          <input className="input" value={draft.tokenomics.totalSupply} onChange={(e) => patch({ tokenomics: { ...draft.tokenomics, totalSupply: e.target.value } })} />
        </Field>
        <Field label="Roadmap (one step per line, max 8)">
          <textarea className="input min-h-24" value={draft.roadmap.join("\n")} onChange={(e) => patch({ roadmap: e.target.value.split("\n").slice(0, 8) })} />
        </Field>
        <Field label="Meme gallery (one https image link per line, max 12)">
          <textarea className="input min-h-24" value={draft.gallery.join("\n")} onChange={(e) => patch({ gallery: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12) })} placeholder="https://..." />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">5. Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["telegram", "twitter", "discord", "website"] as const).map((k) => (
            <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
              <input className="input" value={draft.socials[k]} onChange={(e) => patch({ socials: { ...draft.socials, [k]: e.target.value.trim() } })} placeholder="https://" />
            </Field>
          ))}
        </div>
        {draft.links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input className="input" placeholder="Label" value={l.label} onChange={(e) => patch({ links: draft.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
            <input className="input" placeholder="https://" value={l.url} onChange={(e) => patch({ links: draft.links.map((x, j) => (j === i ? { ...x, url: e.target.value.trim() } : x)) })} />
            <button type="button" aria-label="Remove link" className="btn" onClick={() => patch({ links: draft.links.filter((_, j) => j !== i) })}><Trash2 size={16} /></button>
          </div>
        ))}
        {draft.links.length < 6 && (
          <button type="button" className="btn" onClick={() => patch({ links: [...draft.links, { label: "", url: "" }] })}><Plus size={16} /> Add link</button>
        )}
      </section>

      <PublishPanel draft={draft} />
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Mobile: switch between editor and preview. Desktop: side by side. */}
      <div className="mb-4 flex gap-2 lg:hidden" role="tablist">
        {(["edit", "preview"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn flex-1 ${tab === t ? "bg-chalk text-asphalt" : ""}`}>{t === "edit" ? "Edit" : "Live preview"}</button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className={tab === "edit" ? "block" : "hidden lg:block"}>{form}</div>
        <aside className={`${tab === "preview" ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto border-2 border-curb shadow-blockTag">
            <SitePreview page={draft} />
          </div>
        </aside>
      </div>
    </div>
  );
}
