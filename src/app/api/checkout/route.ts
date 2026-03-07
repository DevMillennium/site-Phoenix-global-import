import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/data/products";
import { getBaseUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe-server";

/** Cria uma sessão do Stripe Checkout e retorna a URL para redirecionar. */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Pagamento temporariamente indisponível. Configure STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { slug, quantity = 1 } = body as { slug?: string; quantity?: number };

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "slug do produto é obrigatório" },
        { status: 400 }
      );
    }

    const product = getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const baseUrl = getBaseUrl();
    const priceReais = product.pricePix ?? product.price;
    const amountCentavos = Math.round(priceReais * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "brl",
      line_items: [
        {
          quantity: Math.max(1, Math.min(quantity, 99)),
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.shortDescription,
              images: product.images[0]
                ? [`${baseUrl}${product.images[0].startsWith("/") ? "" : "/"}${product.images[0]}`]
                : undefined,
            },
            unit_amount: amountCentavos,
          },
        },
      ],
      success_url: `${baseUrl}/produtos/${slug}?pagamento=sucesso`,
      cancel_url: `${baseUrl}/produtos/${slug}?pagamento=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão Stripe:", err);
    return NextResponse.json(
      { error: "Erro ao iniciar pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}
