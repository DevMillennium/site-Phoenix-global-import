# Configuração para produção — 100% operacional

## O que já está feito

- **`.env.local`** criado/atualizado com:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `VERCEL_TOKEN` e `VERCEL_PROJECT` (para scripts)

- **Desenvolvimento local:** o site roda com `npm run dev` usando essas variáveis.

---

## Único passo que falta: variáveis na Vercel

O envio automático (`npm run vercel:env`) retornou **403** — em geral isso acontece quando o projeto está em uma **equipe** na Vercel. Você tem duas opções.

### Opção A — Configurar manualmente na Vercel (recomendado)

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard) e abra o projeto do site.
2. Vá em **Settings → Environment Variables**.
3. Adicione estas variáveis (com os **mesmos valores** do seu `.env.local`) e marque **Production** (e Preview se quiser):

   | Nome | Valor (copie do .env.local) |
   |------|----------------------------|
   | `NEXT_PUBLIC_SITE_URL` | `https://phoenixglobal.com.br` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5585994482323` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (sua pk_live_...) |
   | `STRIPE_SECRET_KEY` | (sua sk_live_...) — marque como **Secret** |

4. Salve e faça **Redeploy** do último deployment de produção (Deployments → ⋯ → Redeploy).

Depois disso o site fica **100% operacional** em produção (Stripe, WhatsApp, sitemap, OG).

### Opção B — Usar o script automático (projeto em equipe)

Se o projeto estiver em uma **equipe** na Vercel:

1. Na Vercel: **Settings → General** do projeto (ou da equipe) e copie o **Team ID**.
2. No `.env.local`, adicione:
   ```env
   VERCEL_TEAM_ID=team_xxxxx
   ```
3. Rode de novo:
   ```bash
   npm run vercel:env
   ```
4. Se ainda der 403, o token pode não ter permissão para a equipe. Crie um novo token em [vercel.com/account/tokens](https://vercel.com/account/tokens) com acesso à equipe e atualize `VERCEL_TOKEN` no `.env.local`.

---

## Sobre a chave `mk_` (Merchant)

A chave **mk_** (Merchant) do Stripe **não** é usada neste projeto. O site usa apenas:

- **Secret key (sk_live_...)** — no servidor (API de checkout)
- **Publishable key (pk_live_...)** — no cliente, se no futuro usar Stripe.js na página

Nada foi configurado com a chave `mk_`.

---

## Segurança

Você enviou chaves em um chat. Recomendações:

1. **Vercel:** em [vercel.com/account/tokens](https://vercel.com/account/tokens), revogue o token atual e crie um novo; atualize o `.env.local` com o novo `VERCEL_TOKEN`.
2. **Stripe:** as chaves já estão em uso. Se considerar que houve exposição, no [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) você pode criar novas chaves e rotacionar (depois atualize na Vercel e no `.env.local`).

---

## Conferência rápida

- **Local:** `npm run dev` — site sobe com env do `.env.local`.
- **Produção:** após colocar as variáveis na Vercel e fazer Redeploy, teste:
  - Abrir um produto → **Pagar com cartão** → deve abrir o Stripe Checkout.
  - Links do WhatsApp devem abrir com o número correto.
  - Sitemap e redes sociais devem usar a URL correta do site.

Com as variáveis preenchidas na Vercel e um Redeploy, o site fica 100% operacional.
