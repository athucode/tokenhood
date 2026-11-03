import Link from "next/link";
import { HOOD_INFO, isHoodLive } from "@/lib/hood-info";
import { CopyButton } from "./CopyButton";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/builder", label: "Build a site" },
  { href: "/feed", label: "Feed" },
];

export function Footer() {
  const { name, symbol, contractAddress, chainName, deployer, x, telegram } = HOOD_INFO;
  return (
    <footer className="relative mt-10 border-t-2 border-curb bg-concrete/40">
      {/* spray stripe */}
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(135deg,#FFD21F_0_14px,#17181C_14px_28px)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-3xl tracking-wide">
            TOKEN<span className="text-spray">HOOD</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-chalk/70">
            Meme and token websites, paid once in ${symbol}. No code, no hosting bill.
          </p>
          <a href={x.url} target="_blank" rel="noopener noreferrer" className="btn mt-5 text-sm hover:border-tag hover:text-tag">
            Follow {x.handle} on X
          </a>
        </div>

        <div>
          <h3 className="font-display text-lg text-tag">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-chalk/80 hover:text-spray">{n.label}</Link></li>
            ))}
            {telegram && <li><a href={telegram} target="_blank" rel="noopener noreferrer" className="text-chalk/80 hover:text-spray">Telegram</a></li>}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-tag">${symbol}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2"><dt className="text-chalk/50">Name</dt><dd>{name}</dd></div>
            <div className="flex gap-2"><dt className="text-chalk/50">Chain</dt><dd>{chainName}</dd></div>
            <div className="flex items-center gap-2">
              <dt className="text-chalk/50">CA</dt>
              <dd className="flex min-w-0 items-center gap-2">
                <code className="truncate text-xs">{contractAddress}</code>
                {isHoodLive && <CopyButton value={contractAddress} />}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="border-t-2 border-curb">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-chalk/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p>
            ${symbol} deployed by{" "}
            {deployer.url
              ? <a href={deployer.url} target="_blank" rel="noopener noreferrer" className="text-caution hover:underline">{deployer.name}</a>
              : <span className="text-caution">{deployer.name}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
