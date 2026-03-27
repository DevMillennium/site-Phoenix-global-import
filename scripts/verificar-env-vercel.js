#!/usr/bin/env node
/**
 * Verifica na Vercel se as variáveis necessárias para o site (Stripe, domínio, WhatsApp)
 * estão configuradas para Production. Usa o mesmo .env.local para token e projeto.
 * Não expõe valores de variáveis secretas.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");

const CHAVES_OBRIGATORIAS = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
];
/** Chaves que a API da Vercel pode não listar (secretas); usamos .env.local como fallback */
const CHAVES_SECRETAS = ["STRIPE_SECRET_KEY"];
const CHAVES_OPCIONAIS = ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"];

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
  if (!fs.existsSync(envPath)) {
    console.error(".env.local não encontrado. Crie o arquivo com VERCEL_TOKEN e VERCEL_PROJECT.");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const vars = parseEnvLocal(envContent);

  let projectIdOrName = process.env.VERCEL_PROJECT || vars.VERCEL_PROJECT;
  let teamId = process.env.VERCEL_TEAM_ID || vars.VERCEL_TEAM_ID;
  const vercelProjectPath = path.join(projectRoot, ".vercel", "project.json");
  if (fs.existsSync(vercelProjectPath)) {
    const projectJson = JSON.parse(fs.readFileSync(vercelProjectPath, "utf8"));
    if (!projectIdOrName) projectIdOrName = projectJson.projectId ?? projectJson.projectName;
    if (!teamId && projectJson.orgId) teamId = projectJson.orgId;
  }
  if (!projectIdOrName) {
    console.error("Defina VERCEL_PROJECT no .env.local.");
    process.exit(1);
  }

  const token = process.env.VERCEL_TOKEN || vars.VERCEL_TOKEN;
  if (!token) {
    console.error("Defina VERCEL_TOKEN no .env.local.");
    process.exit(1);
  }

  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(projectIdOrName)}/env`);
  if (teamId) url.searchParams.set("teamId", teamId);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error("Erro ao consultar Vercel:", res.status, await res.text());
    process.exit(1);
  }

  const body = await res.json();
  const envs = Array.isArray(body) ? body : (body.envs || body.environments || []);
  const byKey = {};
  for (const e of envs) {
    const key = e.key;
    if (!key) continue;
    if (!byKey[key]) byKey[key] = { targets: [], type: e.type };
    const targets = Array.isArray(e.target) ? e.target : (e.target ? [e.target] : []);
    byKey[key].targets = [...new Set([...(byKey[key].targets || []), ...targets])];
  }
  console.log("\n--- Verificação de variáveis na Vercel (Production) ---\n");
  console.log("Projeto:", projectIdOrName);
  console.log("");

  let ok = true;
  for (const key of CHAVES_OBRIGATORIAS) {
    const info = byKey[key];
    const hasProduction = info && info.targets && info.targets.includes("production");
    const isSecret = CHAVES_SECRETAS.includes(key);
    const hasInLocal = !!vars[key];
    const secretOk = isSecret && !hasProduction && hasInLocal;
    if (hasProduction || secretOk) {
      if (secretOk) {
        console.log(`  ✓ ${key}: OK (secreto, não listado pela API; presente no .env.local — rode 'npm run vercel:env' e faça Redeploy)`);
      } else {
        console.log(`  ✓ ${key}: OK (production)`);
      }
      continue;
    }
    ok = false;
    const msg = isSecret && hasInLocal
      ? " — presente no .env.local; rode 'npm run vercel:env' e faça Redeploy na Vercel"
      : " — configure em Settings → Environment Variables e marque Production";
    console.log(`  ✗ ${key}: FALTANDO${msg}`);
  }
  for (const key of CHAVES_OPCIONAIS) {
    const info = byKey[key];
    const hasProduction = info && info.targets && info.targets.includes("production");
    console.log(`  ${hasProduction ? "✓" : "○"} ${key}: ${hasProduction ? "OK (production)" : "opcional"}`);
  }

  console.log("");
  if (!ok) {
    console.log("Ação: Rode 'npm run vercel:env' para enviar as variáveis do .env.local e depois faça Redeploy do deployment de Production na Vercel.");
    console.log("Ou em Vercel: Settings → Environment Variables → adicione STRIPE_SECRET_KEY (e demais) e marque Production → Redeploy.");
    process.exit(1);
  }
  console.log("Todas as variáveis obrigatórias estão configuradas para Production.");
  console.log("Se o site ainda mostrar erro de Stripe, faça um Redeploy do deployment atual (Deployments → ⋯ → Redeploy).");
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
