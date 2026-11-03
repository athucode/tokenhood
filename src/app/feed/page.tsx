import type { Metadata } from "next";
import { Feed } from "@/components/Feed";

export const metadata: Metadata = { title: "The hood feed" };

export default function FeedPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-4xl">The hood feed</h1>
      <Feed />
    </main>
  );
}
