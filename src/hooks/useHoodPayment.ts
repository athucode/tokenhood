"use client";

import { useCallback, useEffect, useMemo } from "react";
import { BaseError, formatUnits } from "viem";
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { HOOD_ABI, HOOD_CHAIN, HOOD_DECIMALS, HOOD_TOKEN_ADDRESS, HOOD_TREASURY_ADDRESS, isHoodConfigured, toHoodUnits } from "@/lib/hood";
import type { Hex, PaymentStatus } from "@/types";

/**
 * Pays `feeHood` $HOOD to the Tokenhood treasury with a plain ERC-20 transfer
 * and exposes a Pending / Success / Failed state machine for the UI.
 *
 * The server re-verifies the transfer from the receipt, so this hook is
 * UX only and never the source of truth for "paid".
 */
export function useHoodPayment(feeHood: number) {
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const fee = useMemo(() => toHoodUnits(feeHood), [feeHood]);

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: HOOD_TOKEN_ADDRESS,
    abi: HOOD_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: HOOD_CHAIN.id,
    query: { enabled: Boolean(address) && isHoodConfigured },
  });

  const { writeContractAsync, data: txHash, isPending: isSigning, error: writeError, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: txHash, chainId: HOOD_CHAIN.id });

  const status: PaymentStatus = useMemo(() => {
    if (txHash) {
      if (receipt.isError || receipt.data?.status === "reverted") return "failed";
      if (receipt.data?.status === "success") return "success";
      return "pending";
    }
    if (isSigning) return "awaiting_signature";
    if (writeError) return "failed";
    return "idle";
  }, [txHash, receipt.isError, receipt.data?.status, isSigning, writeError]);

  // Refresh balance once the payment lands.
  useEffect(() => {
    if (status === "success") void refetchBalance();
  }, [status, refetchBalance]);

  const pay = useCallback(async () => {
    if (!address || !isHoodConfigured) return;
    try {
      if (chainId !== HOOD_CHAIN.id) await switchChainAsync({ chainId: HOOD_CHAIN.id });
      await writeContractAsync({
        address: HOOD_TOKEN_ADDRESS,
        abi: HOOD_ABI,
        functionName: "transfer",
        args: [HOOD_TREASURY_ADDRESS, fee],
        chainId: HOOD_CHAIN.id,
      });
    } catch {
      // Error is surfaced through `writeError` -> status "failed".
    }
  }, [address, chainId, fee, switchChainAsync, writeContractAsync]);

  const errorMessage = useMemo(() => {
    const err = writeError ?? receipt.error;
    if (!err) return status === "failed" && txHash ? "Transaction reverted on-chain." : null;
    if (err instanceof BaseError) return err.shortMessage;
    return err.message;
  }, [writeError, receipt.error, status, txHash]);

  const hasEnough = balance !== undefined ? balance >= fee : undefined;

  return {
    pay,
    reset,
    status,
    txHash: txHash as Hex | undefined,
    errorMessage,
    payer: address as Hex | undefined,
    isConnected,
    isConfigured: isHoodConfigured,
    feeHood,
    balanceFormatted: balance !== undefined ? formatUnits(balance, HOOD_DECIMALS) : undefined,
    hasEnough,
  };
}
