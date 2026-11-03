import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, isAddressEqual } from "viem";
import { getPageBySlug, updatePage } from "@/lib/db";
import { ADMIN_SIG_TTL_MS, HOOD_CHAIN, HOOD_RPC_SERVER, editMessage, isAdmin } from "@/lib/hood";
import { getTemplate } from "@/lib/templates";
import { validateDraft } from "@/lib/validate";
import type { Hex, MemePage, MemePageDraft } from "@/types";

export const dynamic = "force-dynamic";

const client = createPublicClient({ chain: HOOD_CHAIN, transport: http(HOOD_RPC_SERVER) });
type Ctx = { params: Promise<{ slug: string }> };

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const page = await getPageBySlug((await params).slug);
    return page ? NextResponse.json({ page }) : fail("Page not found.", 404);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Server error.", 500);
  }
}

/**
 * Edit flow: the wallet that created the page (or an admin) signs
 * `edit "<slug>" at <ts>`; slug, owner, payment and score can't change.
 */
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const slug = (await params).slug;
    let body: { draft: MemePageDraft; editor: Hex; signature: Hex; ts: number };
    try {
      body = await req.json();
    } catch {
      return fail("Invalid JSON.", 400);
    }
    const { draft, editor, signature, ts } = body;
    if (!draft || !isAddress(editor) || !signature || !Number.isFinite(ts)) return fail("Missing edit details.", 400);
    if (Math.abs(Date.now() - ts) > ADMIN_SIG_TTL_MS) return fail("Signature expired. Sign again.", 401);

    const page = await getPageBySlug(slug);
    if (!page) return fail("Page not found.", 404);
    if (!isAddressEqual(page.owner, editor) && !isAdmin(editor)) return fail("Only the wallet that created this page can edit it.", 403);

    const next: MemePageDraft = { ...draft, slug };
    const errors = validateDraft(next);
    if (!getTemplate(next.templateId)) errors.push("Unknown template.");
    if (errors.length) return fail(errors.join(" "), 400);

    const signedOk = await client.verifyMessage({ address: editor, message: editMessage(slug, ts), signature });
    if (!signedOk) return fail("Signature does not match your wallet.", 401);

    const updated: MemePage = {
      ...next,
      id: page.id,
      owner: page.owner,
      paymentTxHash: page.paymentTxHash,
      status: page.status,
      respect: page.respect,
      createdAt: page.createdAt,
    };
    return NextResponse.json({ page: await updatePage(updated) });
  } catch (e) {
    console.error("[api/pages/slug]", e);
    return fail(e instanceof Error ? e.message : "Server error.", 500);
  }
}
