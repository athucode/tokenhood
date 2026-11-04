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

/** Tokenhood logo. */
export const Mark = ({ size = 28 }: { size?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/logo.png" alt="" aria-hidden width={size} height={size} className="rounded-full" />
);
