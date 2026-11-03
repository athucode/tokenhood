import type { MemePageDraft } from "@/types";
import { getTemplate, DEFAULT_TEMPLATE } from "@/lib/templates";
import { CopyButton } from "./CopyButton";
import { HOOD_CHAIN, buyUrl, hasSwapUrl } from "@/lib/hood";

/**
 * Renders a meme site from a draft or a published page.
 * Server-safe (no hooks) so it's used by both the builder preview and /[slug].
 * Colors come from the page theme, not from the Tokenhood palette.
 */
export function SitePreview({ page }: { page: MemePageDraft }) {
  const tpl = getTemplate(page.templateId) ?? DEFAULT_TEMPLATE;
  const has = (s: (typeof tpl.sections)[number]) => tpl.sections.includes(s);
  const t = page.theme;
  const socials = Object.entries(page.socials).filter(([, v]) => v);
  const ca = page.contractAddress;

  const box = { background: t.surface, color: t.text, borderColor: t.accent } as const;

  return (
    <div style={{ background: t.background, color: t.text }} className="min-h-full w-full text-sm">
      {has("hero") && (
        <section className="relative overflow-hidden">
          {page.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.bannerUrl} alt="" className="h-36 w-full object-cover sm:h-52" />
          ) : (
            <div className="h-36 w-full sm:h-52" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})` }} />
          )}
          <div className="mx-auto -mt-10 flex max-w-2xl flex-col items-center gap-3 px-4 pb-8 text-center">
            {page.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.logoUrl} alt={`${page.tokenName} logo`} className="h-24 w-24 border-4 object-cover" style={{ borderColor: t.accent, background: t.surface }} />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center border-4 font-display text-3xl" style={box}>
                {(page.ticker || "?").slice(0, 3).toUpperCase()}
              </div>
            )}
            <h1 className="font-display text-4xl leading-none sm:text-6xl">{page.tokenName || "Token name"}</h1>
            <p className="font-semibold" style={{ color: t.accent }}>${(page.ticker || "TICKER").toUpperCase()}</p>
            {page.tagline && <p className="max-w-md opacity-80">{page.tagline}</p>}
          </div>
        </section>
      )}

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-10">
        {has("buy") && (
          <section className="border-2 p-4" style={box}>
            <h2 className="mb-2 font-display text-xl">Buy ${(page.ticker || "TICKER").toUpperCase()}</h2>
            {ca ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <code className="break-all text-xs opacity-80">{ca}</code>
                  <CopyButton value={ca} />
                </div>
                <a
                  href={buyUrl(ca)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-2 px-4 py-2 text-center font-semibold"
                  style={{ background: t.accent, color: t.background, borderColor: t.accent }}
                >
                  {hasSwapUrl ? `Buy on ${HOOD_CHAIN.name}` : "View on explorer"}
                </a>
              </>
            ) : (
              <p className="opacity-70">Add a contract address to show the swap button.</p>
            )}
          </section>
        )}

        {has("tokenomics") && (
          <section className="border-2 p-4" style={box}>
            <h2 className="mb-3 font-display text-xl">Tokenomics</h2>
            <div className="border-2 p-3 text-center" style={{ borderColor: t.accent2 }}>
              <p className="text-xs opacity-70">Total supply</p>
              <p className="font-display text-2xl">{page.tokenomics.totalSupply || "-"}</p>
            </div>
          </section>
        )}

        {has("roadmap") && page.roadmap.length > 0 && (
          <section className="border-2 p-4" style={box}>
            <h2 className="mb-3 font-display text-xl">Roadmap</h2>
            <ol className="space-y-2">
              {page.roadmap.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-display" style={{ color: t.accent }}>{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {page.textBefore?.trim() && (
          <section className="whitespace-pre-line border-2 p-4 leading-relaxed" style={box}>{page.textBefore}</section>
        )}

        {has("gallery") && (
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {page.gallery.length === 0 && <p className="col-span-full opacity-70">Add image links to fill the wall.</p>}
            {page.gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${page.tokenName} meme ${i + 1}`} className="aspect-square w-full border-2 object-cover" style={{ borderColor: t.accent }} />
            ))}
          </section>
        )}

        {page.textAfter?.trim() && (
          <section className="whitespace-pre-line border-2 p-4 leading-relaxed" style={box}>{page.textAfter}</section>
        )}

        {(has("socials") || page.links.length > 0) && (socials.length > 0 || page.links.length > 0) && (
          <section className="flex flex-wrap justify-center gap-2">
            {socials.map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="border-2 px-3 py-2 font-semibold capitalize" style={box}>{k}</a>
            ))}
            {page.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="border-2 px-3 py-2 font-semibold" style={{ ...box, borderColor: t.accent2 }}>{l.label}</a>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
