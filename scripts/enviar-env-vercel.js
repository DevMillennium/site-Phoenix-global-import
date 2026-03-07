#!/usr/bin/env node
/**
 * Envia variáveis do .env.local para a Vercel (Stripe e outras).
 * Uso:
 *   1. Crie um token em https://vercel.com/account/tokens
 *   2. No projeto na Vercel, anote o nome do projeto (Settings → General → Project Name)
 *   3. Execute:
 *      VERCEL_TOKEN=seu_token VERCEL_PROJECT=nome-do-projeto node scripts/enviar-env-vercel.js
 *   Ou, após "vercel link" no projeto:
 *      VERCEL_TOKEN=seu_token node scripts/enviar-env-vercel.js
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

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("Defina VERCEL_TOKEN. Crie em: https://vercel.com/account/tokens");
    process.exit(1);
  }

  let projectIdOrName = process.env.VERCEL_PROJECT;
  if (!projectIdOrName) {
    const vercelProjectPath = path.join(projectRoot, ".vercel", "project.json");
    if (fs.existsSync(vercelProjectPath)) {
      const projectJson = JSON.parse(fs.readFileSync(vercelProjectPath, "utf8"));
      projectIdOrName = projectJson.projectId;
    }
  }
  if (!projectIdOrName) {
    console.error("Defina VERCEL_PROJECT (nome do projeto na Vercel) ou rode 'vercel link' no projeto.");
    process.exit(1);
  }

  if (!fs.existsSync(envPath)) {
    console.error(".env.local não encontrado.");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const vars = parseEnvLocal(envContent);

  const keysToSend = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_WHATSAPP_NUMBER",
  ].filter((k) => vars[k]);

  if (keysToSend.length === 0) {
    console.error("Nenhuma das variáveis STRIPE/SITE/WHATSAPP encontrada em .env.local");
    process.exit(1);
  }

  const body = keysToSend.map((key) => ({
    key,
    value: vars[key],
    type: key.includes("SECRET") || key === "STRIPE_SECRET_KEY" ? "secret" : "plain",
    target: ["production", "preview"],
  }));

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(projectIdOrName)}/env?upsert=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Erro Vercel:", res.status, err);
    process.exit(1);
  }

  console.log("Variáveis enviadas para a Vercel:", keysToSend.join(", "));
  console.log("Faça um novo deploy (Redeploy) para aplicar.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
