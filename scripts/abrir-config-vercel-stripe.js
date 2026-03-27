#!/usr/bin/env node
/**
 * Abre no navegador as páginas para configurar Vercel e Stripe.
 * Execute: node scripts/abrir-config-vercel-stripe.js
 * Ou: npm run config:abrir (se adicionado ao package.json)
 */

const { execSync } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const URLs = {
  vercelDashboard: "https://vercel.com/dashboard",
  vercelTokens: "https://vercel.com/account/tokens",
  stripeApiKeys: "https://dashboard.stripe.com/apikeys",
};

function open(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    execSync(`${command} "${url}"`, { stdio: "inherit" });
  } catch (e) {
    console.log("Abra manualmente:", url);
  }
}

console.log("\n--- Abrindo páginas de configuração ---\n");

console.log("1. Vercel — dashboard (depois: escolha o projeto → Settings → Environment Variables):");
open(URLs.vercelDashboard);

console.log("2. Vercel — criar token (opcional; para usar npm run vercel:env):");
open(URLs.vercelTokens);

console.log("3. Stripe — chaves da API (copie a Secret key para STRIPE_SECRET_KEY):");
open(URLs.stripeApiKeys);

console.log("\nDepois:");
console.log("  • Coloque no .env.local: VERCEL_TOKEN, VERCEL_PROJECT, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WHATSAPP_NUMBER, STRIPE_SECRET_KEY");
console.log("  • Na Vercel: Settings → Environment Variables → adicione as mesmas variáveis e marque Production");
console.log("  • Rode: npm run vercel:env  (para enviar .env.local à Vercel)");
console.log("  • Faça Redeploy do projeto na Vercel\n");
