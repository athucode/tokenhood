import type { Metadata } from "next";
import { Builder } from "@/components/Builder";

export const metadata: Metadata = { title: "Build a meme site" };

type Props = { searchParams: Promise<{ edit?: string }> };

export default async function BuilderPage({ searchParams }: Props) {
  const { edit } = await searchParams;
  return <main><Builder editSlug={edit || undefined} /></main>;
}
