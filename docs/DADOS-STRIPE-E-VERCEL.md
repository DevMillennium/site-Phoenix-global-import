# Dados para 100% de funcionalidade — Stripe e Vercel

Este documento consolida as variáveis e passos necessários para o site ficar **100% funcional**, com base nos commits do repositório e na integração Stripe + deploy na Vercel.

> **Nota:** No projeto não há integração com “Vertex”; a publicação em produção é feita pela **Vercel**. Os dados abaixo cobrem Stripe (pagamento) e Vercel (ambiente de produção).
>
> **Site em produção:** quando o site for acessado em **phoenixglobal.com.br**, use a [Análise detalhada (Stripe, Vercel e phoenixglobal.com.br)](./ANALISE-ENV-PHOENIXGLOBAL.md) para conferir todos os elementos e o checklist de funcionamento real.

---

## 1. Variáveis de ambiente obrigatórias

| Variável | Onde é usada | Onde obter |
| -------- | ------------- | ---------- |
| `NEXT_PUBLIC_SITE_URL` | Sitemap, Open Graph, URLs de sucesso/cancelamento do Stripe, `absoluteUrl()` | Domínio do site (ex.: `https://phoenixglobal.com.br`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Todos os links `wa.me` (contato, cotação, carrinho, compra) | Número com DDI, sem `+` (ex.: `5585994482323`) |
| `STRIPE_SECRET_KEY` | API `/api/checkout` — criação da sessão Stripe Checkout | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) (chave secreta, ex.: `sk_live_...`) |

### Opcional (para uso futuro no cliente)

| Variável | Uso |
| -------- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js no front (ex.: formulário de cartão na própria página). Hoje o fluxo usa apenas redirect para Stripe Checkout. |

---

## 2. Stripe — como conectar

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com) e faça login.
2. Vá em **Developers → API keys**.
3. Copie:
   - **Secret key** (ex.: `sk_live_...` ou `sk_test_...`) → use como `STRIPE_SECRET_KEY`.
   - (Opcional) **Publishable key** (ex.: `pk_live_...`) → use como `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` se for usar Stripe no front.
4. Em produção, use chaves **live**; em desenvolvimento pode usar **test**.
5. Não commite as chaves. Use `.env.local` localmente e variáveis de ambiente na Vercel.

O código que usa o Stripe está em:

- `src/app/api/checkout/route.ts` — lê `STRIPE_SECRET_KEY` e cria a sessão de checkout (commit `609e190`).
- `src/lib/stripe-server.ts` — helper `getStripe()` (usado em outros fluxos, se necessário).
- `src/lib/env-check.ts` — verificação de env (checagem de `STRIPE_SECRET_KEY`).

---

## 3. Vercel — como garantir as variáveis em produção

### Opção A: Script automático (recomendado)

1. Crie um token em [https://vercel.com/account/tokens](https://vercel.com/account/tokens).
2. No projeto, preencha `.env.local` com as mesmas chaves que deseja na Vercel (incluindo `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).
3. Rode (veja [docs/VERCEL-ENV-AUTOMATICO.md](./VERCEL-ENV-AUTOMATICO.md)):

   ```bash
   VERCEL_TOKEN=seu_token VERCEL_PROJECT=nome-do-projeto npm run vercel:env
   ```

4. Faça um **Redeploy** do projeto na Vercel para as variáveis passarem a valer.

### Opção B: Manual no painel

1. No projeto na Vercel: **Settings → Environment Variables**.
2. Adicione cada variável (nome e valor).
3. Marque **Production** (e Preview se quiser).
4. Redeploy.

---

## 4. Referência rápida a partir dos commits

- **5a6a1be** — Stripe: checkout API, botão “Pagar com cartão”, `.env.example` com Stripe e demais vars.
- **609e190** — Checkout lê `STRIPE_SECRET_KEY` na rota (evita problema em serverless).
- **e52e738** — Domínio `phoenixglobal.com.br`, script `vercel:env`, ajustes Stripe no build.
- **03d8e13** — WhatsApp Business e uso de env para número.
- **0d18bb4** — Sitemap, loading, WhatsApp via `getWhatsAppLink`, produtos em SSR.

Com essas variáveis configuradas (local em `.env.local` e na Vercel para produção), o site fica **100% funcional** em relação a:

- Links WhatsApp (contato, cotação, carrinho, compra).
- Pagamento com cartão (Stripe Checkout).
- SEO e Open Graph (URL canônica e imagens).
- Sitemap e redirects pós-pagamento.

---

## 5. Checklist antes do deploy

- [ ] `NEXT_PUBLIC_SITE_URL` = URL final do site (ex.: `https://phoenixglobal.com.br`).
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` = número com DDI (ex.: `5585994482323`).
- [ ] `STRIPE_SECRET_KEY` = chave secreta Stripe (live ou test) configurada na Vercel.
- [ ] Nenhuma chave real no repositório (apenas em `.env.local` e na Vercel).
- [ ] Após alterar env na Vercel, fazer **Redeploy** do projeto.
