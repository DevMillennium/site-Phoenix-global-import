import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductBySlug } from "@/data/products";
import { SLUG_TO_SKU, emitPaiosSaleCompleted } from "@/lib/paios-webhook";

export const runtime = "nodejs";

function parseSlugsFromMetadata(metadata: Stripe.Metadata | null): Array<{ slug: string; quantity: number }> {
  const raw = metadata?.slugs?.trim();
  if (!raw) return [];
  return raw.split(",").map((part) => {
    const [slug, qtyStr] = part.split(":");
    const quantity = Math.max(1, parseInt(qtyStr ?? "1", 10) || 1);
    return { slug: slug.trim(), quantity };
  });
}

/**
 * POST /api/webhooks/stripe — checkout.session.completed → PAIOS sale.completed
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !whSecret) {
    return NextResponse.json({ error: "Stripe webhook não configurado" }, { status: 503 });
  }

  const stripe = new Stripe(secret, { typescript: true });
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Assinatura inválida";
    console.error("[stripe-webhook]", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, skipped: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: "not_paid" });
  }

  const lineItems = parseSlugsFromMetadata(session.metadata ?? null);
  const totalReais = (session.amount_total ?? 0) / 100;
  const soldAt = new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000).toISOString();

  if (lineItems.length === 0) {
    console.warn("[stripe-webhook] session sem slugs em metadata", session.id);
    return NextResponse.json({ received: true, skipped: "no_slugs" });
  }

  const totalQty = lineItems.reduce((s, l) => s + l.quantity, 0);
  let allocated = 0;

  for (let i = 0; i < lineItems.length; i++) {
    const { slug, quantity } = lineItems[i];
    const product = getProductBySlug(slug);
    const mapping = SLUG_TO_SKU[slug];
    const isLast = i === lineItems.length - 1;

    let revenue: number;
    if (lineItems.length === 1) {
      revenue = totalReais;
    } else if (isLast) {
      revenue = Math.round((totalReais - allocated) * 100) / 100;
    } else {
      revenue = Math.round((totalReais * (quantity / totalQty)) * 100) / 100;
      allocated += revenue;
    }

    const payload = {
      event_type: "sale.completed" as const,
      external_id: `stripe-${session.id}-${slug}`,
      sku: mapping?.sku ?? slug.toUpperCase().replace(/-/g, "-").slice(0, 32),
      location: mapping?.location ?? "Fortaleza",
      quantity,
      revenue,
      product_name: product?.name ?? slug,
      sold_at: soldAt,
      channel: "phoenixglobal.com.br",
      metadata: {
        stripe_session_id: session.id,
        slug,
        customer_email: session.customer_details?.email ?? null,
      },
    };

    await emitPaiosSaleCompleted(payload);
  }

  return NextResponse.json({ received: true, processed: lineItems.length });
}
