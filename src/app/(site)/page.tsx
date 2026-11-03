import Link from "next/link";
import { Feed } from "@/components/Feed";
import { HoodSpotlight } from "@/components/HoodSpotlight";
import { TEMPLATES } from "@/lib/templates";
import { PALETTES } from "@/lib/palettes";
import type { LayoutId } from "@/types";

const STEPS: [string, string][] = [
  ["Pick a layout and colors", "Three layouts, twenty color sets. The preview updates as you type."],
  ["Add your token", "Name, ticker, contract, images, roadmap, links and your own text."],
  ["Pay once in $HOOD", "One transfer from your wallet and the page is live at its own address."],
];

const PRICE = TEMPLATES[0].priceHood;

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div>
            <h1 className="max-w-[12ch] text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              A home on the web for your token.
            </h1>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-smoke">
              Build a token site in minutes, pay once in $HOOD and share one clean link. No code and no hosting bill.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/builder" className="btn-primary px-6 py-3 text-[15px]">Build your site</Link>
              <Link href="/feed" className="btn px-6 py-3 text-[15px]">Browse the feed</Link>
            </div>
            <p className="mt-6 text-sm text-smoke">{PRICE.toLocaleString()} $HOOD per site. Edits are free.</p>
          </div>
          <HoodSpotlight />
        </div>
      </section>

      {/* Steps: a real sequence, so numbered */}
      <section className="border-y border-curb">
        <ol className="mx-auto grid max-w-6xl divide-y divide-curb px-5 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="py-10 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="text-sm tabular-nums text-smoke">{i + 1}</span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 max-w-[34ch] leading-relaxed text-smoke">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Layouts */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Three layouts. Every one shows everything.</h2>
          <p className="text-smoke">Same price for all: {PRICE.toLocaleString()} $HOOD</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href="/builder" className="group rounded-3xl border border-curb bg-concrete p-5 transition-colors hover:border-chalk/30">
              <LayoutSketch layout={t.layout} />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-smoke">{t.tagline}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 rounded-3xl border border-curb p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Twenty color sets</h3>
            <p className="mt-1 text-sm text-smoke">Picked so every site is readable and looks finished.</p>
          </div>
          <ul className="flex flex-wrap gap-1.5" aria-label="Available color sets">
            {PALETTES.map((p) => (
              <li key={p.id} title={p.name} className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-curb" style={{ background: p.theme.background }}>
                <span className="absolute inset-[7px] rounded-full" style={{ background: p.theme.accent }} />
                <span className="absolute bottom-[5px] right-[5px] h-2 w-2 rounded-full" style={{ background: p.theme.accent2 }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feed */}
      <section className="mx-auto max-w-3xl px-5 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">New on the block</h2>
          <Link href="/feed" className="text-sm text-smoke underline decoration-curb underline-offset-4 hover:text-chalk">See all</Link>
        </div>
        <Feed limit={4} />
      </section>
    </main>
  );
}

/** Small wireframe of each layout, so people can see the difference before picking. */
function LayoutSketch({ layout }: { layout: LayoutId }) {
  const line = "#2E2E33";
  const soft = "#1A1A1D";
  const pink = "#FF3EA5";
  return (
    <svg aria-hidden viewBox="0 0 240 150" className="w-full rounded-2xl bg-asphalt">
      {layout === "poster" && (
        <>
          <rect x="108" y="16" width="24" height="24" rx="8" fill={line} />
          <rect x="62" y="48" width="116" height="12" rx="6" fill="#F4F4F2" />
          <rect x="84" y="66" width="72" height="5" rx="2.5" fill={line} />
          <rect x="76" y="82" width="88" height="56" rx="10" fill={soft} stroke={pink} />
          <rect x="86" y="92" width="40" height="8" rx="4" fill={pink} />
          <rect x="86" y="122" width="68" height="8" rx="4" fill={line} />
        </>
      )}
      {layout === "split" && (
        <>
          <rect x="18" y="22" width="20" height="20" rx="7" fill={line} />
          <rect x="18" y="50" width="88" height="12" rx="6" fill="#F4F4F2" />
          <rect x="18" y="68" width="64" height="12" rx="6" fill="#F4F4F2" />
          <rect x="18" y="88" width="80" height="5" rx="2.5" fill={line} />
          <rect x="18" y="104" width="22" height="10" rx="5" fill={line} />
          <rect x="44" y="104" width="22" height="10" rx="5" fill={line} />
          <rect x="128" y="22" width="94" height="106" rx="12" fill={soft} stroke={pink} />
          <rect x="140" y="34" width="44" height="9" rx="4.5" fill={pink} />
          <rect x="140" y="104" width="70" height="10" rx="5" fill={line} />
        </>
      )}
      {layout === "gallery" && (
        <>
          <rect x="70" y="14" width="100" height="10" rx="5" fill="#F4F4F2" />
          <rect x="18" y="34" width="132" height="62" rx="8" fill={line} />
          <rect x="156" y="34" width="66" height="28" rx="8" fill={soft} />
          <rect x="156" y="68" width="66" height="28" rx="8" fill={soft} />
          <rect x="18" y="104" width="96" height="34" rx="9" fill={soft} stroke={pink} />
          <rect x="28" y="113" width="34" height="7" rx="3.5" fill={pink} />
          <rect x="124" y="108" width="98" height="5" rx="2.5" fill={line} />
          <rect x="124" y="120" width="70" height="5" rx="2.5" fill={line} />
        </>
      )}
    </svg>
  );
}
