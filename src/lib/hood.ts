import { robinhood } from "viem/chains";
import { erc20Abi, parseUnits } from "viem";
import type { Hex } from "@/types";
import { HOOD_INFO } from "./hood-info";

/** Chain where $HOOD lives. Change here if the token moves. */
export const HOOD_CHAIN = robinhood;

/** RPC for the HOOD chain (falls back to the chain's public RPC). Old BASE_* names still work. */
export const HOOD_RPC_PUBLIC = process.env.NEXT_PUBLIC_RPC_URL || process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined;
export const HOOD_RPC_SERVER = process.env.RPC_URL || process.env.BASE_RPC_URL || HOOD_RPC_PUBLIC;

/** Uniswap's chain name for Robinhood Chain in app.uniswap.org links. */
const UNISWAP_CHAIN = "robinhood";
export const uniswapUrl = (ca: string) => `https://app.uniswap.org/swap?chain=${UNISWAP_CHAIN}&outputCurrency=${ca}`;
export const explorerTokenUrl = (ca: string) => `${HOOD_CHAIN.blockExplorers.default.url}/token/${ca}`;

/** Optional override for the Buy button: NEXT_PUBLIC_SWAP_URL with {ca} as the token placeholder. */
const SWAP_URL = process.env.NEXT_PUBLIC_SWAP_URL || "";
export const buyUrl = (ca: string) => (SWAP_URL ? SWAP_URL.replaceAll("{ca}", ca) : uniswapUrl(ca));

const ZERO = "0x0000000000000000000000000000000000000000" as Hex;

/**
 * Token used to charge the fee. Source: NEXT_PUBLIC_HOOD_TOKEN_ADDRESS if set, otherwise the
 * contractAddress in lib/hood-info.ts. Deliberately NOT read from the editable /hood page,
 * so editing a page can never change what users pay with.
 */
const isCA = (a?: string) => Boolean(a && /^0x[0-9a-fA-F]{40}$/.test(a));
export const HOOD_TOKEN_ADDRESS = (isCA(process.env.NEXT_PUBLIC_HOOD_TOKEN_ADDRESS)
  ? process.env.NEXT_PUBLIC_HOOD_TOKEN_ADDRESS
  : isCA(HOOD_INFO.contractAddress) ? HOOD_INFO.contractAddress : ZERO) as Hex;
export const HOOD_TREASURY_ADDRESS = (process.env.NEXT_PUBLIC_TREASURY_ADDRESS || ZERO) as Hex;
export const HOOD_DECIMALS = Number(process.env.NEXT_PUBLIC_HOOD_DECIMALS ?? 18);

/** True once the env vars are set; the UI shows a setup warning otherwise. */
export const isHoodConfigured = HOOD_TOKEN_ADDRESS !== ZERO && HOOD_TREASURY_ADDRESS !== ZERO;

export const HOOD_ABI = erc20Abi;

/** Whole $HOOD -> token base units. */
export const toHoodUnits = (amount: number): bigint => parseUnits(String(amount), HOOD_DECIMALS);

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "tokenhood.online";

/** Message the payer signs to prove they own the payment (prevents tx-hash front-running). */
export const publishMessage = (slug: string, txHash: string) =>
  `Tokenhood: publish "${slug}" with payment ${txHash}`;

/**
 * Admin wallets publish without paying. Comma-separated in NEXT_PUBLIC_ADMIN_ADDRESSES.
 * Public on purpose (the UI needs it); security comes from the server checking the admin's signature.
 */
export const ADMIN_ADDRESSES = (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES ?? "")
  .split(",")
  .map((a) => a.trim().toLowerCase())
  .filter((a) => /^0x[0-9a-f]{40}$/.test(a));

export const isAdmin = (addr?: string | null) => Boolean(addr) && ADMIN_ADDRESSES.includes(addr!.toLowerCase());

/** Admin publish is signed with a timestamp so a signature can't be replayed later. */
export const adminPublishMessage = (slug: string, ts: number) => `Tokenhood admin: publish "${slug}" at ${ts}`;
export const ADMIN_SIG_TTL_MS = 10 * 60 * 1000;

/** Owner (or admin) edit, also timestamped against replay. */
export const editMessage = (slug: string, ts: number) => `Tokenhood: edit "${slug}" at ${ts}`;

/** Admin-only delete, timestamped like the others. */
export const deleteMessage = (slug: string, ts: number) => `Tokenhood admin: delete "${slug}" at ${ts}`;
