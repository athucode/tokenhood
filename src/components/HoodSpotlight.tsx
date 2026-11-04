import Link from "next/link";
import type { HoodInfo } from "@/lib/hood-live";
import { explorerTokenUrl, uniswapUrl } from "@/lib/hood";
import { CopyButton } from "./CopyButton";

/** The $HOOD token card used as the homepage hero visual. Values live in lib/hood-info.ts. */
export function HoodSpotlight({ info }: { info: HoodInfo }) {
  const { name, symbol, contractAddress, chainName, deployer, x, pagePath, isLive: isHoodLive } = info;
  const rows: [string, React.ReactNode][] = [
    ["Name", name],
    ["Symbol", `$${symbol}`],
    ["Chain", chainName],
    ["Deployed by", deployer.url ? <a href={deployer.url} target="_blank" rel="noopener noreferrer" className="underline decoration-curb underline-offset-4 hover:decoration-chalk">{deployer.name}</a> : deployer.name],
    ["X", <a key="x" href={x.url} target="_blank" rel="noopener noreferrer" className="underline decoration-curb underline-offset-4 hover:decoration-chalk">{x.handle}</a>],
  ];
  if (pagePath) rows.push(["Website", <Link key="site" href={pagePath} className="underline decoration-curb underline-offset-4 hover:decoration-chalk">tokenhood.online{pagePath}</Link>]);

  return (
    <div className="relative">
      {/* faint orbit lines behind the card */}
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[30rem] w-[30rem] opacity-60">
        {[70, 110, 150, 190].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke={i === 1 ? "#FF3EA5" : "#F4F4F2"} strokeOpacity={i === 1 ? 0.35 : 0.08} strokeWidth="1" />
        ))}
        <circle cx="310" cy="122" r="4" fill="#FF3EA5" />
      </svg>

      <div className="overflow-hidden rounded-3xl border border-curb bg-concrete/90 backdrop-blur">
        <div className="flex items-start justify-between gap-4 p-6 pb-5">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hood.jpg" alt={`$${symbol}`} width={72} height={72} className="h-[72px] w-[72px] rounded-full" />
            <div>
              <p className="text-sm text-smoke">The token behind every site</p>
              <p className="mt-1 text-5xl font-semibold tracking-[-0.04em]">${symbol}</p>
            </div>
          </div>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-curb px-2.5 py-1 text-xs text-smoke">
            <span className={`h-1.5 w-1.5 rounded-full ${isHoodLive ? "bg-[#3BE08A]" : "bg-smoke"}`} />
            {isHoodLive ? "Live" : "Launching soon"}
          </span>
        </div>

        <dl className="divide-y divide-curb border-t border-curb text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-6 py-3">
              <dt className="text-smoke">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
          <div className="px-6 py-4">
            <dt className="mb-2 flex items-center justify-between text-smoke">
              Contract
              {isHoodLive && <CopyButton value={contractAddress} className="rounded-full border text-chalk" />}
            </dt>
            <dd className="break-all rounded-xl bg-asphalt px-3 py-2.5 font-mono text-[13px] leading-relaxed">{contractAddress}</dd>
          </div>
        </dl>

        {isHoodLive && (
          <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-curb p-4">
            <a href={uniswapUrl(contractAddress)} target="_blank" rel="noopener noreferrer" className="btn-primary">Buy ${symbol} on Uniswap</a>
            <a href={explorerTokenUrl(contractAddress)} target="_blank" rel="noopener noreferrer" className="btn">Explorer</a>
          </div>
        )}
      </div>
    </div>
  );
}
