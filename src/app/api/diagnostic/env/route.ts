import { NextResponse } from "next/server";
import { checkSiteEnv, checkStripeEnv } from "@/lib/env-check";

/**
 * Apenas desenvolvimento: estados booleanos (nunca valores secretos).
 * Produção: 404.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Não disponível" }, { status: 404 });
  }

  const site = checkSiteEnv();
  const stripe = checkStripeEnv();
  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim() ?? "";
  const deepseekOk =
    deepseekKey.length >= 20 &&
    deepseekKey.startsWith("sk-") &&
    !deepseekKey.includes("...");

  return NextResponse.json({
    siteEnvOk: site.ok,
    stripeOk: stripe.stripeReady,
    deepseekOk,
    checkoutEAssistenteOk: stripe.stripeReady && deepseekOk,
    hints: {
      site: site.message,
      stripe: stripe.message,
    },
  });
}
