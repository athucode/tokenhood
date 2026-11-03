import Link from "next/link";
import { HOOD_INFO, isHoodLive } from "@/lib/hood-info";
import { explorerTokenUrl, uniswapUrl } from "@/lib/hood";
import { CopyButton } from "./CopyButton";
import { Mark } from "./Header";

const NAV = [
  { href: "/builder", label: "Build a site" },
  { href: "/feed", label: "Feed" },
];

export function Footer() {
  const { name, symbol, contractAddress, chainName, deployer, x, telegram } = HOOD_INFO;
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  const link = "text-smoke transition-colors hover:text-chalk";

  return (
    <footer className="border-t border-curb">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"><Mark /> Tokenhood</Link>
          <p className="mt-4 text-sm leading-relaxed text-smoke">Token websites paid once in ${symbol}, on {chainName}.</p>
        </div>

        <nav aria-label="Tokenhood" className="text-sm">
          <ul className="space-y-2.5">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className={link}>{n.label}</Link></li>)}
          </ul>
        </nav>

        <ul className="space-y-2.5 text-sm">
          <li><a href={x.url} {...ext} className={link}>X {x.handle}</a></li>
          {telegram && <li><a href={telegram} {...ext} className={link}>Telegram</a></li>}
          {isHoodLive && <li><a href={uniswapUrl(contractAddress)} {...ext} className={link}>Buy on Uniswap</a></li>}
          {isHoodLive && <li><a href={explorerTokenUrl(contractAddress)} {...ext} className={link}>Explorer</a></li>}
        </ul>
      </div>

      <div className="border-t border-curb">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-smoke md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span>${symbol} contract</span>
            <code className="break-all font-mono text-chalk/80">{contractAddress}</code>
            {isHoodLive && <CopyButton value={contractAddress} className="rounded-full border text-chalk" />}
          </div>
          <p className="shrink-0">
            © {new Date().getFullYear()} {name}. Deployed by{" "}
            {deployer.url ? <a href={deployer.url} {...ext} className="text-chalk/80 hover:text-chalk">{deployer.name}</a> : <span className="text-chalk/80">{deployer.name}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
