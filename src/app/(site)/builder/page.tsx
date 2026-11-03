import type { Metadata } from "next";
import { Builder } from "@/components/Builder";

export const metadata: Metadata = { title: "Build a meme site" };

export default function BuilderPage() {
  return <main><Builder /></main>;
}
