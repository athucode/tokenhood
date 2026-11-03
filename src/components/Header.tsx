"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-curb bg-asphalt/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-2xl tracking-wide">
          TOKEN<span className="text-spray">HOOD</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex">
          <Link href="/feed" className="hover:text-tag">Feed</Link>
          <Link href="/builder" className="hover:text-tag">Build a site</Link>
        </nav>
        <ConnectButton chainStatus="icon" showBalance={false} accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
      </div>
    </header>
  );
}
