#!/usr/bin/env node
/**
 * Diagnóstico de ambiente para loja + assistente (sem imprimir segredos completos).
 * Lê .env.local e sobrescreve com variáveis já exportadas no shell.
 *
 * Uso:
 *   npm run pleno
 *   npm run pleno -- --strict     → exit 1 se Stripe ou DeepSeek inválidos
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");

function parseEnvLocal(content) {
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function mergedEnv() {
  const file = fs.existsSync(envPath) ? parseEnvLocal(fs.readFileSync(envPath, "utf8")) : {};
  const out = { ...file };
  for (const k of Object.keys(process.env)) {
    if (process.env[k] !== undefined) out[k] = process.env[k];
  }
  return out;
}

function maskSecret(val) {
  if (!val || typeof val !== "string") return null;
  const t = val.trim();
  if (t.length < 8) return "•••";
  return `${t.slice(0, 7)}… (${t.length} caracteres)`;
}

function okStripe(v) {
  if (!v || typeof v !== "string") return false;
  const t = v.trim();
  return (
    t.length >= 20 &&
    !t.includes("...") &&
    (t.startsWith("sk_live_") || t.startsWith("sk_test_"))
  );
}

function okDeepSeek(v) {
  if (!v || typeof v !== "string") return false;
  const t = v.trim();
  return t.length >= 20 && !t.includes("...") && t.startsWith("sk-");
}

function okUrl(v) {
  if (!v || typeof v !== "string") return false;
  return /^https:\/\/.+/i.test(v.trim()) && !v.includes("...");
}

function okWhatsapp(v) {
  if (!v || typeof v !== "string") return false;
  const d = v.replace(/\D/g, "");
  return d.length >= 10 && d.length <= 15;
}

function main() {
  const strict = process.argv.includes("--strict");
  const env = mergedEnv();

  console.log("\n══ Pleno funcionamento — Phoenix Global Import ══\n");
  console.log("Origem: variáveis do shell + .env.local (shell tem prioridade)");
  console.log(fs.existsSync(envPath) ? `Arquivo: ${envPath}\n` : `⚠ .env.local não encontrado — copie com: npm run setup:env\n`);

  const stripeOk = okStripe(env.STRIPE_SECRET_KEY);
  const deepseekOk = okDeepSeek(env.DEEPSEEK_API_KEY);
  const siteOk = okUrl(env.NEXT_PUBLIC_SITE_URL);
  const waOk = okWhatsapp(env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const pkOk =
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    (env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_live_") ||
      env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_")) &&
    !env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("...");

  console.log("[Stripe — checkout /api/checkout]");
  console.log(
    `  STRIPE_SECRET_KEY: ${stripeOk ? "✓ OK" : "✗ inválida ou ausente"} ${stripeOk ? maskSecret(env.STRIPE_SECRET_KEY) : ""}`,
  );
  console.log(
    `  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${pkOk ? "✓ OK" : "○ opcional / placeholder"} ${pkOk ? maskSecret(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : ""}`,
  );

  console.log("\n[DeepSeek — assistente Shyr /api/atendente]");
  console.log(
    `  DEEPSEEK_API_KEY: ${deepseekOk ? "✓ OK" : "✗ inválida ou ausente"} ${deepseekOk ? maskSecret(env.DEEPSEEK_API_KEY) : ""}`,
  );
  if (env.DEEPSEEK_MODEL) {
    console.log(`  DEEPSEEK_MODEL: ${env.DEEPSEEK_MODEL}`);
  } else {
    console.log("  DEEPSEEK_MODEL: (padrão deepseek-chat)");
  }

  console.log("\n[Site público — Vercel]");
  console.log(
    `  NEXT_PUBLIC_SITE_URL: ${siteOk ? "✓ OK" : "○ use URL canónica https://..."} ${siteOk ? env.NEXT_PUBLIC_SITE_URL : "(código usa fallback se vazio)"}`,
  );
  console.log(
    `  NEXT_PUBLIC_WHATSAPP_NUMBER: ${waOk ? "✓ OK" : "○ ausente — código usa número padrão"} ${waOk ? `(DDI+DDD+numero, ${env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "").length} dígitos)` : ""}`,
  );

  const tudo = stripeOk && deepseekOk;
  console.log("\n── Resumo ──");
  console.log(
    tudo
      ? "✓ Checkout + assistente podem funcionar se as chaves estiverem corretas na Vercel e tiver sido feito Redeploy."
      : "! Complete .env.local, rode npm run vercel:env e Redeploy na Vercel.",
  );
  if (!stripeOk) console.log("  → Pagamento: defina STRIPE_SECRET_KEY (sk_live_ ou sk_test_).");
  if (!deepseekOk) console.log("  → Assistente: defina DEEPSEEK_API_KEY (https://platform.deepseek.com).");

  console.log("\nComandos úteis:  npm run setup:env  |  npm run vercel:env  |  npm run vercel:check\n");

  if (strict && (!stripeOk || !deepseekOk)) {
    process.exit(1);
  }
}

main();
