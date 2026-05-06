#!/usr/bin/env node
/**
 * Cria .env.local a partir de .env.example se ainda não existir (não sobrescreve).
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const example = path.join(root, ".env.example");
const local = path.join(root, ".env.local");

if (fs.existsSync(local)) {
  console.log(".env.local já existe — não alterado.");
  process.exit(0);
}

if (!fs.existsSync(example)) {
  console.error(".env.example não encontrado.");
  process.exit(1);
}

fs.copyFileSync(example, local);
console.log("Criado .env.local a partir de .env.example.");
console.log("Preencha STRIPE_SECRET_KEY, DEEPSEEK_API_KEY e demais chaves; depois: npm run pleno");
process.exit(0);
