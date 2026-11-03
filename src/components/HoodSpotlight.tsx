import { HOOD_INFO, isHoodLive } from "@/lib/hood-info";
import { CopyButton } from "./CopyButton";

/** Featured $HOOD token block on the homepage. Values live in lib/hood-info.ts. */
export function HoodSpotlight() {
  const { name, symbol, contractAddress, chainName, deployer, x } = HOOD_INFO;
  const rows: [string, React.ReactNode][] = [
    ["Name", name],
    ["Symbol", `$${symbol}`],
    ["Chain", chainName],
    ["Deployed by", deployer.url
      ? <a href={deployer.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-spray">{deployer.name}</a>
      : deployer.name],
    ["X", <a key="x" href={x.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-tag">{x.handle}</a>],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="relative border-2 border-caution bg-concrete p-6 shadow-[6px_6px_0_0_#FFD21F] sm:p-8">
        <span className="absolute -top-4 left-6 bg-caution px-3 py-1 font-display text-sm tracking-wider text-asphalt">FEATURED TOKEN</span>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="font-display text-5xl leading-none sm:text-6xl">
              {name} <span className="text-spray">${symbol}</span>
            </h2>
            <p className="mt-4 max-w-md text-chalk/75">
              ${symbol} is the currency of the block. Every Tokenhood site is paid in ${symbol}, so every new meme page puts the token to work.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {isHoodLive && (
                <a href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${contractAddress}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Buy ${symbol}
                </a>
              )}
              <a href={x.url} target="_blank" rel="noopener noreferrer" className="btn">Follow {x.handle}</a>
            </div>
          </div>

          <dl className="divide-y-2 divide-curb border-2 border-curb bg-asphalt">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-sm text-chalk/50">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-chalk/50">CA</dt>
              <dd className="flex min-w-0 items-center gap-2">
                <code className="break-all text-xs">{contractAddress}</code>
                {isHoodLive && <CopyButton value={contractAddress} />}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
