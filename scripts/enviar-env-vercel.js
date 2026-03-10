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
  if (!fs.existsSync(envPath)) {
    console.error(".env.local não encontrado.");
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
    console.error("Defina VERCEL_PROJECT no .env.local ou rode 'vercel link' no projeto.");
    process.exit(1);
  }

  const token = process.env.VERCEL_TOKEN || vars.VERCEL_TOKEN;
  if (!token) {
    console.error("Defina VERCEL_TOKEN (variável de ambiente ou em .env.local). Crie em: https://vercel.com/account/tokens");
    process.exit(1);
  }

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

  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(projectIdOrName)}/env`);
  url.searchParams.set("upsert", "true");
  if (teamId) url.searchParams.set("teamId", teamId);
  const res = await fetch(url.toString(),
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
    console.error("Erro Vercel (env):", res.status, err);
    if (res.status === 403) {
      console.error("\nDica: Se o projeto está em uma equipe, defina VERCEL_TEAM_ID no .env.local (Settings → General na Vercel). Use um token com permissão de escrita em https://vercel.com/account/tokens");
    }
    process.exit(1);
  }

  console.log("Variáveis enviadas para a Vercel:", keysToSend.join(", "));

  // Redeploy automático: listar último deployment de produção e redeployar
  const deploymentsUrl = new URL("https://api.vercel.com/v6/deployments");
  deploymentsUrl.searchParams.set("projectId", projectIdOrName);
  deploymentsUrl.searchParams.set("target", "production");
  deploymentsUrl.searchParams.set("limit", "1");
  if (teamId) deploymentsUrl.searchParams.set("teamId", teamId);

  const listRes = await fetch(deploymentsUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!listRes.ok) {
    console.log("Redeploy: não foi possível listar deployments. Faça Redeploy manual na Vercel.");
    return;
  }

  const listData = await listRes.json();
  const deployments = listData.deployments || listData;
  const latest = Array.isArray(deployments) ? deployments[0] : null;
  const deploymentId = latest?.uid || latest?.id;

  if (!deploymentId) {
    console.log("Redeploy: nenhum deployment de produção encontrado. Faça deploy manual.");
    return;
  }

  const redeployUrl = new URL("https://api.vercel.com/v13/deployments");
  if (teamId) redeployUrl.searchParams.set("teamId", teamId);

  const redeployRes = await fetch(redeployUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectIdOrName,
      deploymentId,
    }),
  });

  if (!redeployRes.ok) {
    const errText = await redeployRes.text();
    console.log("Redeploy: falha ao disparar.", redeployRes.status, errText);
    return;
  }

  const redeployData = await redeployRes.json();
  console.log("Redeploy disparado. Status:", redeployData.state || "iniciado");
  console.log("Acompanhe em: https://vercel.com/dashboard");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
