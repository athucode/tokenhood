"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV = [
  { href: "/feed", label: "Feed" },
  { href: "/builder", label: "Build a site" },
];

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-curb/70 bg-asphalt/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <Mark /> Tokenhood
        </Link>
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${path === n.href ? "bg-concrete text-chalk" : "text-smoke hover:text-chalk"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <ConnectButton chainStatus="icon" showBalance={false} accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
      </div>
    </header>
  );
}

/** Tokenhood mark: a rounded block with a pink door. */
export const Mark = ({ size = 22 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 24 24">
    <rect x="1.5" y="1.5" width="21" height="21" rx="6.5" fill="#F4F4F2" />
    <rect x="9" y="10" width="6" height="12.5" rx="3" fill="#FF3EA5" />
  </svg>
);
