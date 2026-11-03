import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SitePreview } from "@/components/SitePreview";
import { getPageBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** Each token page carries its own title, icon and share card — no Tokenhood branding. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug((await params).slug);
  if (!page) return { title: "Not found" };
  const title = `${page.tokenName} ($${page.ticker.toUpperCase()})`;
  const img = page.bannerUrl.startsWith("https://") ? page.bannerUrl : page.logoUrl.startsWith("https://") ? page.logoUrl : undefined;
  return {
    title: { absolute: title },
    description: page.tagline,
    icons: page.logoUrl ? { icon: page.logoUrl } : undefined,
    openGraph: { title, description: page.tagline, images: img ? [img] : undefined },
    twitter: { card: img ? "summary_large_image" : "summary", title, description: page.tagline },
  };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const page = await getPageBySlug((await params).slug);
  return { themeColor: page?.theme.background ?? "#17181C" };
}

export default async function MemeSite({ params }: Props) {
  const page = await getPageBySlug((await params).slug);
  if (!page) notFound();
  const t = page.theme;
  const ticker = page.ticker.toUpperCase();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: t.background, color: t.text }}>
      <main className="flex-1"><SitePreview page={page} /></main>
      <footer className="border-t-2" style={{ borderColor: t.accent, background: t.surface }}>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-4 py-6 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <p className="font-display text-base">
            {page.tokenName} <span style={{ color: t.accent }}>${ticker}</span>
          </p>
          <p className="opacity-60">© {new Date().getFullYear()} {page.tokenName}. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
