import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductBySlug } from "@/data/products";
import { getBaseUrl, absoluteUrl } from "@/lib/env";
import { checkStripeEnv } from "@/lib/env-check";
import { parseCheckoutBody } from "@/lib/checkout-schema";

type LineInput = { slug: string; quantity: number };

function buildLineItems(inputs: LineInput[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const lines: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const { slug, quantity } of inputs) {
    const product = getProductBySlug(slug);
    if (!product) {
      throw new Error(`Produto não encontrado: ${slug}`);
    }
    if (!product.inStock) {
      throw new Error(`Produto indisponível: ${product.name}`);
    }
    const priceReais = product.pricePix ?? product.price;
    const amountCentavos = Math.round(priceReais * 100);
    lines.push({
      quantity: Math.max(1, Math.min(quantity, 99)),
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          description: product.shortDescription,
          images: product.images[0] ? [absoluteUrl(product.images[0])] : undefined,
        },
        unit_amount: amountCentavos,
      },
    });
  }
  return lines;
}

/**
 * POST /api/checkout — Checkout Session (um produto ou carrinho).
 * Preços sempre do servidor (getProductBySlug); nunca confiar no cliente.
 */
export async function POST(request: NextRequest) {
  const stripeCheck = checkStripeEnv();
  if (!stripeCheck.stripeReady) {
    return NextResponse.json(
      {
        error:
          stripeCheck.message ??
          "Pagamento temporariamente indisponível. Configure STRIPE_SECRET_KEY na Vercel (Production).",
      },
      { status: 503 }
    );
  }
  const secret = process.env.STRIPE_SECRET_KEY!;
  const stripe = new Stripe(secret, { typescript: true });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = parseCheckoutBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const baseUrl = getBaseUrl();

  let lineInputs: LineInput[];
  let successPath: string;
  let cancelPath: string;

  if (parsed.data.mode === "cart") {
    const merged = new Map<string, number>();
    for (const row of parsed.data.items) {
      const q = Math.max(1, Math.min(99, row.quantity ?? 1));
      merged.set(row.slug, (merged.get(row.slug) ?? 0) + q);
    }
    lineInputs = Array.from(merged.entries()).map(([slug, quantity]) => ({ slug, quantity }));
    successPath = `${baseUrl}/carrinho?pagamento=sucesso&session_id={CHECKOUT_SESSION_ID}`;
    cancelPath = `${baseUrl}/carrinho?pagamento=cancelado`;
  } else {
    lineInputs = [
      {
        slug: parsed.data.slug,
        quantity: Math.max(1, Math.min(99, parsed.data.quantity ?? 1)),
      },
    ];
    const slug = parsed.data.slug;
    successPath = `${baseUrl}/produtos/${slug}?pagamento=sucesso&session_id={CHECKOUT_SESSION_ID}`;
    cancelPath = `${baseUrl}/produtos/${slug}?pagamento=cancelado`;
  }

  try {
    const line_items = buildLineItems(lineInputs);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",
      line_items,
      success_url: successPath,
      cancel_url: cancelPath,
      metadata: {
        source: parsed.data.mode === "cart" ? "cart" : "pdp",
        slugs: lineInputs.map((l) => `${l.slug}:${l.quantity}`).join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao criar sessão Stripe:", err);
    if (message.includes("não encontrado") || message.includes("indisponível")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao iniciar pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}
