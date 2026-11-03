import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, isAddressEqual, parseEventLogs, erc20Abi } from "viem";
import { getPageBySlug, insertPage, isTxUsed, listPages } from "@/lib/db";
import { HOOD_CHAIN, HOOD_TOKEN_ADDRESS, HOOD_TREASURY_ADDRESS, isHoodConfigured, publishMessage, toHoodUnits } from "@/lib/hood";
import { getTemplate } from "@/lib/templates";
import { validateDraft } from "@/lib/validate";
import type { Hex, MemePage, MemePageDraft } from "@/types";

export const dynamic = "force-dynamic";

const client = createPublicClient({ chain: HOOD_CHAIN, transport: http(process.env.BASE_RPC_URL || undefined) });

export async function GET() {
  return NextResponse.json({ pages: await listPages() });
}

/**
 * Publish flow (never trust the client):
 *  1. validate the draft,
 *  2. verify the payer signed "publish <slug> with <txHash>",
 *  3. verify the tx receipt contains a $HOOD Transfer payer -> treasury >= template fee,
 *  4. make sure the slug and tx hash are unused, then store.
 */
export async function POST(req: Request) {
  if (!isHoodConfigured) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  let body: { draft: MemePageDraft; txHash: Hex; payer: Hex; signature: Hex };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { draft, txHash, payer, signature } = body;

  if (!draft || !/^0x[0-9a-fA-F]{64}$/.test(txHash) || !isAddress(payer) || !signature)
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });

  const errors = validateDraft(draft);
  const template = getTemplate(draft.templateId);
  if (!template) errors.push("Unknown template.");
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  const signedOk = await client.verifyMessage({ address: payer, message: publishMessage(draft.slug, txHash), signature });
  if (!signedOk) return NextResponse.json({ error: "Signature does not match the payer wallet." }, { status: 401 });

  if (await getPageBySlug(draft.slug)) return NextResponse.json({ error: "That address is taken." }, { status: 409 });
  if (await isTxUsed(txHash)) return NextResponse.json({ error: "This payment already published a page." }, { status: 409 });

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({ hash: txHash });
  } catch {
    return NextResponse.json({ error: "Transaction not found yet. Try again in a moment." }, { status: 404 });
  }
  if (receipt.status !== "success") return NextResponse.json({ error: "Payment transaction failed." }, { status: 402 });

  const fee = toHoodUnits(template!.priceHood);
  const transfers = parseEventLogs({ abi: erc20Abi, eventName: "Transfer", logs: receipt.logs });
  const paid = transfers.some(
    (l) =>
      isAddressEqual(l.address, HOOD_TOKEN_ADDRESS) &&
      isAddressEqual(l.args.from, payer) &&
      isAddressEqual(l.args.to, HOOD_TREASURY_ADDRESS) &&
      l.args.value >= fee,
  );
  if (!paid) return NextResponse.json({ error: "No valid $HOOD payment found in that transaction." }, { status: 402 });

  const page: MemePage = {
    ...draft,
    id: crypto.randomUUID(),
    owner: payer,
    paymentTxHash: txHash,
    status: "published",
    respect: 0,
    createdAt: new Date().toISOString(),
  };
  const saved = await insertPage(page);
  return NextResponse.json({ page: saved }, { status: 201 });
}
