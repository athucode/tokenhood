import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, isAddressEqual, keccak256, parseEventLogs, erc20Abi, toHex } from "viem";
import { getPageBySlug, insertPage, isTxUsed, listPages } from "@/lib/db";
import { ADMIN_SIG_TTL_MS, HOOD_CHAIN, HOOD_TOKEN_ADDRESS, HOOD_TREASURY_ADDRESS, adminPublishMessage, isAdmin, isHoodConfigured, publishMessage, toHoodUnits } from "@/lib/hood";
import { getTemplate } from "@/lib/templates";
import { validateDraft } from "@/lib/validate";
import type { Hex, MemePage, MemePageDraft } from "@/types";

export const dynamic = "force-dynamic";

const client = createPublicClient({ chain: HOOD_CHAIN, transport: http(process.env.BASE_RPC_URL || undefined) });

export async function GET() {
  try {
    return NextResponse.json({ pages: await listPages() });
  } catch (e) {
    return serverError(e);
  }
}

/** Always answer with JSON so the client can show the real cause (e.g. a Supabase error). */
function serverError(e: unknown) {
  console.error("[api/pages]", e);
  return NextResponse.json({ error: e instanceof Error ? e.message : "Server error." }, { status: 500 });
}

/**
 * Publish flow (never trust the client):
 *  1. validate the draft,
 *  2. verify the payer signed "publish <slug> with <txHash>",
 *  3. verify the tx receipt contains a $HOOD Transfer payer -> treasury >= template fee,
 *  4. make sure the slug and tx hash are unused, then store.
 */
export async function POST(req: Request) {
  try {
    return await handlePost(req);
  } catch (e) {
    return serverError(e);
  }
}

async function handlePost(req: Request) {
  let body: { draft: MemePageDraft; txHash: Hex; payer: Hex; signature: Hex; adminTs?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { draft, txHash, payer, signature, adminTs } = body;

  // Admin path: no $HOOD fee, just a fresh signature from an admin wallet.
  if (adminTs !== undefined) return publishAsAdmin(draft, payer, signature, adminTs);

  if (!isHoodConfigured) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

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

async function publishAsAdmin(draft: MemePageDraft, payer: Hex, signature: Hex, ts: number) {
  if (!draft || !isAddress(payer) || !signature || !Number.isFinite(ts))
    return NextResponse.json({ error: "Missing admin details." }, { status: 400 });
  if (!isAdmin(payer)) return NextResponse.json({ error: "Not an admin wallet." }, { status: 403 });
  if (Math.abs(Date.now() - ts) > ADMIN_SIG_TTL_MS) return NextResponse.json({ error: "Admin signature expired. Sign again." }, { status: 401 });

  const errors = validateDraft(draft);
  if (!getTemplate(draft.templateId)) errors.push("Unknown template.");
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  const signedOk = await client.verifyMessage({ address: payer, message: adminPublishMessage(draft.slug, ts), signature });
  if (!signedOk) return NextResponse.json({ error: "Signature does not match the admin wallet." }, { status: 401 });

  if (await getPageBySlug(draft.slug)) return NextResponse.json({ error: "That address is taken." }, { status: 409 });

  // No real payment: store a unique pseudo hash so the tx_hash unique column still holds.
  const pseudoTx = keccak256(toHex(`admin:${payer.toLowerCase()}:${draft.slug}:${ts}`));
  if (await isTxUsed(pseudoTx)) return NextResponse.json({ error: "This admin signature was already used." }, { status: 409 });

  const page: MemePage = {
    ...draft,
    id: crypto.randomUUID(),
    owner: payer,
    paymentTxHash: pseudoTx,
    status: "published",
    respect: 0,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json({ page: await insertPage(page) }, { status: 201 });
}
