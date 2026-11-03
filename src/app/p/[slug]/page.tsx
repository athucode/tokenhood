import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePreview } from "@/components/SitePreview";
import { getPageBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug((await params).slug);
  if (!page) return { title: "Not found" };
  return { title: `${page.tokenName} ($${page.ticker.toUpperCase()})`, description: page.tagline };
}

export default async function MemeSite({ params }: Props) {
  const page = await getPageBySlug((await params).slug);
  if (!page) notFound();
  return (
    <>
      <SitePreview page={page} />
      <footer className="bg-asphalt py-3 text-center text-xs text-chalk/60">
        Built on <Link href="/builder" className="text-spray underline">Tokenhood</Link>
      </footer>
    </>
  );
}
