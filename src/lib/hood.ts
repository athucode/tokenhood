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
