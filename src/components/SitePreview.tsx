import type { CSSProperties, ReactNode } from "react";
import { AtSign, Globe, Link2, MessagesSquare, Send } from "lucide-react";
import type { LayoutId, MemePageDraft } from "@/types";
import { getTemplate, DEFAULT_TEMPLATE } from "@/lib/templates";
import { HOOD_CHAIN, buyUrl, explorerTokenUrl } from "@/lib/hood";
import { onColor } from "@/lib/palettes";
import { CopyButton } from "./CopyButton";

/**
 * Renders a token site from a draft or a published page (builder preview and /[slug]).
 * Server-safe (no hooks). Uses container queries so the builder preview matches mobile.
 * Every layout shows everything the user filled in; the template only arranges it.
 */
export function SitePreview({ page }: { page: MemePageDraft }) {
  const layout: LayoutId = (getTemplate(page.templateId) ?? DEFAULT_TEMPLATE).layout;
  const t = page.theme;
  const vars = {
    "--bg": t.background,
    "--sf": t.surface,
    "--tx": t.text,
    "--ac": t.accent,
    "--a2": t.accent2,
    "--on-ac": onColor(t.accent, t),
    "--on-a2": onColor(t.accent2, t),
    "--font-display": "var(--font-anton)",
    background: t.background,
    color: t.text,
  } as CSSProperties;

  const ticker = (page.ticker || "TICKER").toUpperCase();
  const seed = hash(page.slug || page.tokenName || "hood");

  const ticket = <TokenTicket page={page} ticker={ticker} />;
  const story = <Story page={page} featured={layout === "gallery"} />;
  const roadmap = <Roadmap steps={page.roadmap.filter((s) => s.trim())} />;
  const links = <Links page={page} />;

  return (
    <div style={vars} className="@container min-h-full w-full overflow-hidden font-sans text-[15px] antialiased">
      {layout === "poster" && (
        <>
          <Hero page={page} seed={seed} align="center" />
          <div className="relative z-10 mx-auto -mt-6 w-full max-w-md px-5">{ticket}</div>
          <Body>
            {story}
            {roadmap}
            {links}
          </Body>
        </>
      )}

      {layout === "split" && (
        <>
          <Hero page={page} seed={seed} align="left" aside={ticket} after={links} />
          <Body>
            {roadmap}
            {story}
          </Body>
        </>
      )}

      {layout === "gallery" && (
        <>
          <Hero page={page} seed={seed} align="center" compact />
          <Body>
            {story}
            <div className="grid gap-10 @3xl:grid-cols-[minmax(0,26rem)_1fr] @3xl:items-start">
              {ticket}
              {roadmap}
            </div>
            {links}
          </Body>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const Body = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-5 pb-16 pt-12 @3xl:px-10">{children}</div>
);

function Hero({ page, seed, align, compact, aside, after }: { page: MemePageDraft; seed: number; align: "center" | "left"; compact?: boolean; aside?: ReactNode; after?: ReactNode }) {
  const center = align === "center";
  return (
    <section className="relative isolate">
      {page.bannerUrl ? (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.bannerUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, color-mix(in srgb, var(--bg) 35%, transparent) 0%, var(--bg) 92%)` }} />
        </div>
      ) : (
        <HeroPattern seed={seed} />
      )}

      <div
        className={`mx-auto grid w-full max-w-5xl gap-10 px-5 @3xl:px-10 ${compact ? "py-14" : "pb-16 pt-16 @3xl:pb-24 @3xl:pt-24"} ${
          aside ? "@3xl:grid-cols-[1.15fr_0.85fr] @3xl:items-center" : ""
        }`}
      >
        <div className={`flex flex-col gap-5 ${center ? "items-center text-center" : "items-start"}`}>
          <Logo page={page} />
          <h1 className="max-w-[14ch] break-words font-display leading-[0.88] tracking-tight" style={{ fontSize: compact ? "clamp(2.5rem, 11cqw, 5.5rem)" : "clamp(3rem, 15cqw, 8.5rem)" }}>
            {page.tokenName || "Token name"}
          </h1>
          {page.tagline && <p className={`max-w-[42ch] text-lg leading-snug opacity-80 ${center ? "" : ""}`}>{page.tagline}</p>}
          {after && <div className="mt-2">{after}</div>}
        </div>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </section>
  );
}

function Logo({ page }: { page: MemePageDraft }) {
  const ring = { boxShadow: "0 0 0 3px var(--bg), 0 0 0 6px var(--ac)" };
  return page.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={page.logoUrl} alt={`${page.tokenName} logo`} className="h-24 w-24 rounded-[30%] object-cover @3xl:h-28 @3xl:w-28" style={ring} />
  ) : (
    <div className="flex h-24 w-24 items-center justify-center rounded-[30%] font-display text-3xl" style={{ ...ring, background: "var(--ac)", color: "var(--on-ac)" }}>
      {(page.ticker || "?").slice(0, 3).toUpperCase()}
    </div>
  );
}

/** Soft rings + dot grid behind the hero when there is no banner. Varies per page via `seed`. */
function HeroPattern({ seed }: { seed: number }) {
  const cx = 70 + (seed % 25);
  const cy = 15 + ((seed >> 3) % 30);
  const id = `dots-${seed}`;
  return (
    <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 60"
      style={{ maskImage: "linear-gradient(180deg, #000 55%, transparent)", WebkitMaskImage: "linear-gradient(180deg, #000 55%, transparent)" }}>
      <defs>
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.28" fill="var(--tx)" opacity="0.22" />
        </pattern>
        <radialGradient id={`${id}-glow`} cx={`${cx}%`} cy={`${cy * 1.6}%`} r="60%">
          <stop offset="0%" stopColor="var(--ac)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--ac)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="60" fill={`url(#${id}-glow)`} />
      <rect width="100" height="60" fill={`url(#${id})`} />
      {[10, 18, 27, 37].map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={i % 2 ? "var(--a2)" : "var(--ac)"} strokeWidth="0.35" opacity={0.5 - i * 0.1} />
      ))}
    </svg>
  );
}

/* ---------- The token ticket: the one loud element on the page ---------- */

function TokenTicket({ page, ticker }: { page: MemePageDraft; ticker: string }) {
  const ca = page.contractAddress;
  const supply = page.tokenomics.totalSupply;
  return (
    <div className="relative">
      <Sticker ticker={ticker} />
      <div className="overflow-hidden rounded-[28px] border-2" style={{ background: "var(--sf)", borderColor: "var(--ac)", boxShadow: "0 24px 60px -24px color-mix(in srgb, var(--ac) 55%, transparent)" }}>
        <div className="px-6 pb-6 pt-7">
          <p className="text-sm opacity-70">{page.tokenName || "Token name"}</p>
          <p className="mt-1 break-all font-display leading-none" style={{ color: "var(--ac)", fontSize: "clamp(2.75rem, 12cqw, 4.5rem)" }}>${ticker}</p>
        </div>

        {/* perforation */}
        <div className="relative h-0">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: "var(--bg)" }} />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ background: "var(--bg)" }} />
          <div className="mx-6 border-t-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--tx) 22%, transparent)" }} />
        </div>

        <dl className="space-y-4 px-6 pb-6 pt-6 text-sm">
          <div>
            <dt className="mb-1.5 flex items-center justify-between gap-3 opacity-60">
              Contract
              {ca && <span className="opacity-100" style={{ color: "var(--tx)" }}><CopyButton value={ca} className="rounded-full" /></span>}
            </dt>
            <dd className="break-all rounded-xl px-3 py-2.5 font-mono text-[13px] font-semibold leading-snug" style={{ background: "color-mix(in srgb, var(--tx) 7%, transparent)" }}>
              {ca || <span className="font-sans font-normal opacity-60">Coming soon</span>}
            </dd>
          </div>
          <Row label="Chain">
            <span className="flex items-center gap-2 font-semibold"><ChainGlyph /> {HOOD_CHAIN.name}</span>
          </Row>
          {supply && <Row label="Total supply"><span className="font-semibold tabular-nums">{supply}</span></Row>}
        </dl>

        {ca && (
          <div className="grid grid-cols-[1fr_auto] gap-2 px-6 pb-6">
            <a href={buyUrl(ca)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-bold transition-transform active:scale-[0.98]"
              style={{ background: "var(--ac)", color: "var(--on-ac)" }}>
              Buy ${ticker} on Uniswap
            </a>
            <a href={explorerTokenUrl(ca)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center rounded-2xl px-4 py-4 text-sm font-semibold"
              style={{ boxShadow: "inset 0 0 0 2px color-mix(in srgb, var(--tx) 25%, transparent)" }}>
              Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <dt className="shrink-0 opacity-60">{label}</dt>
    <dd className="flex min-w-0 justify-end">{children}</dd>
  </div>
);

/** Rotated starburst with the ticker, pinned to the ticket corner. */
function Sticker({ ticker }: { ticker: string }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = i % 2 ? 40 : 50;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  const label = ticker.length > 6 ? ticker.slice(0, 6) : ticker;
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-3 -top-7 z-10 h-[5.5rem] w-[5.5rem] rotate-12 drop-shadow-lg">
      <polygon points={pts} fill="var(--a2)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="var(--on-a2)" strokeWidth="1.2" strokeDasharray="2 2.5" opacity="0.6" />
      <text x="50" y="47" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--on-a2)">on chain</text>
      <text x="50" y="64" textAnchor="middle" fontSize={label.length > 4 ? 15 : 19} fontFamily="var(--font-display), Impact, sans-serif" fill="var(--on-a2)">${label}</text>
    </svg>
  );
}

const ChainGlyph = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--ac)" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 2 20.5 7v10L12 22 3.5 17V7z" />
    <path d="M12 8 16 10.3v4.4L12 17l-4-2.3v-4.4z" fill="var(--ac)" />
  </svg>
);

/* ---------- Content ---------- */

function Story({ page, featured }: { page: MemePageDraft; featured: boolean }) {
  const before = page.textBefore?.trim();
  const after = page.textAfter?.trim();
  if (!before && !after && page.gallery.length === 0) return null;
  return (
    <section className="flex flex-col gap-8">
      {before && <TextBlock text={before} />}
      {page.gallery.length > 0 && (
        <div className="grid grid-flow-row-dense grid-cols-2 gap-3 @3xl:grid-cols-3">
          {page.gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`${page.tokenName} meme ${i + 1}`}
              className={`h-full w-full rounded-2xl object-cover ${tileClass(i, page.gallery.length, featured)}`}
              style={{ background: "var(--sf)" }} />
          ))}
        </div>
      )}
      {after && <TextBlock text={after} />}
    </section>
  );
}

const TextBlock = ({ text }: { text: string }) => (
  <div className="max-w-[65ch] whitespace-pre-line border-l-4 pl-5 text-base leading-relaxed @3xl:text-lg" style={{ borderColor: "var(--ac)" }}>
    {text}
  </div>
);

function Roadmap({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <section>
      <h2 className="mb-6 font-display text-3xl @3xl:text-4xl">Roadmap</h2>
      <ol className="relative space-y-5">
        <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-0.5" style={{ background: "color-mix(in srgb, var(--tx) 18%, transparent)" }} />
        {steps.map((step, i) => (
          <li key={i} className="relative flex items-start gap-4">
            <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm"
              style={i === 0 ? { background: "var(--ac)", color: "var(--on-ac)" } : { background: "var(--sf)", boxShadow: "inset 0 0 0 2px var(--ac)" }}>
              {i + 1}
            </span>
            <span className="pt-1 text-base">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const SOCIAL: Record<string, { label: string; icon: ReactNode }> = {
  twitter: { label: "X", icon: <AtSign size={18} /> },
  telegram: { label: "Telegram", icon: <Send size={18} /> },
  discord: { label: "Discord", icon: <MessagesSquare size={18} /> },
  website: { label: "Website", icon: <Globe size={18} /> },
};

function Links({ page }: { page: MemePageDraft }) {
  const socials = Object.entries(page.socials).filter(([, v]) => v);
  if (!socials.length && !page.links.length) return null;
  const pill = "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold";
  return (
    <nav aria-label="Links" className="flex flex-wrap gap-2">
      {socials.map(([k, v]) => (
        <a key={k} href={v} target="_blank" rel="noopener noreferrer" className={pill} style={{ background: "var(--tx)", color: "var(--bg)" }}>
          {SOCIAL[k]?.icon} {SOCIAL[k]?.label ?? k}
        </a>
      ))}
      {page.links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={pill} style={{ boxShadow: "inset 0 0 0 2px var(--a2)" }}>
          <Link2 size={18} /> {l.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Spans the first tiles so every row is full: 2 columns on small screens, 3 on wide ones.
 * Class strings are literal so Tailwind keeps them.
 */
function tileClass(i: number, n: number, featured: boolean) {
  const small = i === 0 && n % 2 === 1 ? "col-span-2 aspect-[2/1]" : "col-span-1 aspect-square";
  const r = n % 3;
  let wide = "@3xl:col-span-1 @3xl:row-span-1 @3xl:aspect-square";
  if (n === 1) wide = "@3xl:col-span-3 @3xl:aspect-[2/1]";
  else if (r === 0 && featured && i === 0) wide = "@3xl:col-span-2 @3xl:row-span-2 @3xl:aspect-square";
  else if (r === 2 && i === 0) wide = "@3xl:col-span-2 @3xl:row-span-1 @3xl:aspect-[2/1]";
  else if (r === 1 && i < 2) wide = "@3xl:col-span-2 @3xl:row-span-1 @3xl:aspect-[2/1]";
  return `${small} ${wide}`;
}

/* ---------- helpers ---------- */

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}
