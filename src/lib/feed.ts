import type { FeedFilter, MemePage } from "@/types";

/** Reddit-style decay: respect divided by age^1.5 so new pages can surface. */
const hotScore = (p: MemePage) => {
  const ageH = Math.max(0, (Date.now() - new Date(p.createdAt).getTime()) / 36e5);
  return p.respect / Math.pow(ageH + 2, 1.5);
};

export function sortPages(pages: MemePage[], filter: FeedFilter): MemePage[] {
  const list = [...pages];
  if (filter === "latest") return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  if (filter === "top") return list.sort((a, b) => b.respect - a.respect);
  return list.sort((a, b) => hotScore(b) - hotScore(a));
}
