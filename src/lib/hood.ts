import { base } from "wagmi/chains";
import { erc20Abi, parseUnits } from "viem";
import type { Hex } from "@/types";

/** Chain where $HOOD lives. Change here if the token moves. */
export const HOOD_CHAIN = base;

const ZERO = "0x0000000000000000000000000000000000000000" as Hex;

export const HOOD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_HOOD_TOKEN_ADDRESS || ZERO) as Hex;
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
