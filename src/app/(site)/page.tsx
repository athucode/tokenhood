import Link from "next/link";
import { Feed } from "@/components/Feed";
import { HeroTag } from "@/components/HeroTag";
import { HoodSpotlight } from "@/components/HoodSpotlight";
import { TEMPLATES } from "@/lib/templates";

const STEPS = [
  ["Pick a template", "Three layouts built for memes and tokens, same price."],
  ["Fill in your token", "Name, ticker, contract, links, colors. The preview updates as you type."],
  ["Pay in $HOOD", "One transfer from your wallet. Your page goes live right after."],
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl">Your meme gets its own block.</h1>
          <p className="mt-5 max-w-md text-lg text-chalk/80">Build a website for your token in minutes and pay once in $HOOD. No code, no hosting bill.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/builder" className="btn-primary">Build your site</Link>
            <Link href="/feed" className="btn">Browse the feed</Link>
          </div>
        </div>
        <HeroTag />
      </section>

      <HoodSpotlight />

      <section className="border-y-2 border-curb bg-concrete/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="flex gap-4">
              <span className="font-display text-4xl text-tag">{i + 1}</span>
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-chalk/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 font-display text-3xl">Templates and prices</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href="/builder" className="card block p-4 hover:border-spray">
              <h3 className="font-display text-xl">{t.name}</h3>
              <p className="mt-1 text-sm text-chalk/70">{t.tagline}</p>
              <p className="mt-3 font-semibold text-caution">{t.priceHood.toLocaleString()} $HOOD</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-3xl">Hot on the block</h2>
          <Link href="/feed" className="text-sm font-semibold text-tag underline">See all</Link>
        </div>
        <Feed limit={4} />
      </section>
    </main>
  );
}
