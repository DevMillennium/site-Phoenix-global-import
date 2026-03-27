/**
 * Verificação de variáveis de ambiente necessárias para 100% de funcionalidade.
 * Baseado nos commits: Stripe (5a6a1be, 609e190), Vercel env (e52e738), WhatsApp (03d8e13).
 * Use apenas no servidor (rotas API, server components).
 */

export const ENV_KEYS = {
  /** URL do site (sitemap, OG, redirects Stripe). */
  SITE_URL: "NEXT_PUBLIC_SITE_URL",
  /** Número WhatsApp com DDI (links wa.me). */
  WHATSAPP: "NEXT_PUBLIC_WHATSAPP_NUMBER",
  /** Chave secreta Stripe (API checkout). */
  STRIPE_SECRET: "STRIPE_SECRET_KEY",
  /** Chave publicável Stripe (opcional; para Stripe.js no cliente no futuro). */
  STRIPE_PUBLISHABLE: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
} as const;

export interface EnvCheckResult {
  ok: boolean;
  missing: string[];
  stripeReady: boolean;
  message?: string;
}

/**
 * Verifica se as variáveis mínimas para o site estão definidas (SITE_URL, WHATSAPP).
 * Não expõe valores, apenas nomes das chaves faltando.
 */
export function checkSiteEnv(): EnvCheckResult {
  const missing: string[] = [];
  if (!process.env[ENV_KEYS.SITE_URL]?.trim()) missing.push(ENV_KEYS.SITE_URL);
  if (!process.env[ENV_KEYS.WHATSAPP]?.trim()) missing.push(ENV_KEYS.WHATSAPP);
  return {
    ok: missing.length === 0,
    missing,
    stripeReady: false,
    message:
      missing.length > 0
        ? `Configure no .env.local e na Vercel: ${missing.join(", ")}`
        : undefined,
  };
}

/**
 * Verifica se o Stripe está configurado para a rota de checkout.
 * Conforme Stripe Authentication: https://docs.stripe.com/api/authentication
 * Exige STRIPE_SECRET_KEY com prefixo sk_test_ ou sk_live_ (nunca pk_).
 */
export function checkStripeEnv(): EnvCheckResult {
  const secret = process.env[ENV_KEYS.STRIPE_SECRET];
  const isString = typeof secret === "string" && secret.trim().length > 0;
  const validPrefix = isString && (secret!.startsWith("sk_test_") || secret!.startsWith("sk_live_"));
  const noPlaceholder = isString && !secret!.includes("...");
  const stripeSecretOk = isString && secret!.length >= 20 && noPlaceholder && validPrefix;
  const missing: string[] = [];
  if (!stripeSecretOk) missing.push(ENV_KEYS.STRIPE_SECRET);

  let message: string | undefined;
  if (missing.length > 0) {
    if (isString && secret!.startsWith("pk_"))
      message = "Use a Secret key (sk_live_ ou sk_test_), não a Publishable key. Veja https://dashboard.stripe.com/apikeys";
    else
      message = "Configure STRIPE_SECRET_KEY na Vercel (Production). Obtenha em https://dashboard.stripe.com/apikeys";
  }

  return {
    ok: missing.length === 0,
    missing,
    stripeReady: stripeSecretOk,
    message,
  };
}
