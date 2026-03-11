# Análise: Stripe e domínio (www)

Site: **<https://www.phoenixglobal.com.br>**

Verificação de que o Stripe está **devidamente funcional** quando o site é acessado em **<https://www.phoenixglobal.com.br>**.

---

## 1. Fluxo do pagamento com cartão (resumo)

1. Usuário está em **<https://www.phoenixglobal.com.br/produtos/[slug]>** e clica em **"Pagar com cartão"**.
2. O front chama `POST /api/checkout` (URL relativa, ou seja, no mesmo host **<https://www.phoenixglobal.com.br>**).
3. A API (Vercel serverless) lê `STRIPE_SECRET_KEY` e `getBaseUrl()` (que usa `NEXT_PUBLIC_SITE_URL`).
4. Cria uma sessão Stripe Checkout com:
   - `success_url`: `${baseUrl}/produtos/${slug}?pagamento=sucesso`
   - `cancel_url`: `${baseUrl}/produtos/${slug}?pagamento=cancelado`
   - Imagem do produto: `${baseUrl}${product.images[0]}`
5. Responde com `{ url: session.url }`; o front redireciona o usuário para a página do Stripe.
6. Após pagar ou cancelar, o Stripe redireciona o usuário para o `success_url` ou `cancel_url` que foram enviados na criação da sessão.

Para o domínio **www** funcionar corretamente, esses redirects precisam apontar para **<https://www.phoenixglobal.com.br>**.

---

## 2. Onde o domínio é usado no fluxo Stripe

| Arquivo | Uso | Impacto (domínio www) |
| ------- | --- | ---------------------- |
| `src/lib/env.ts` | `getBaseUrl()` usa `process.env.NEXT_PUBLIC_SITE_URL`; fallback <https://phoenixglobal.com.br> (sem www) | Se a variável **não** estiver definida na Vercel, o redirect volta para o domínio **sem www**, e o usuário que acessou pelo **www** pode ver inconsistência ou perder sessão. |
| `src/app/api/checkout/route.ts` | `const baseUrl = getBaseUrl()`; usado em `success_url`, `cancel_url` e na URL da imagem do produto no Checkout | **Crítico:** `NEXT_PUBLIC_SITE_URL` em Production deve ser **exatamente** <https://www.phoenixglobal.com.br> quando o site é servido em www. |
| `src/app/layout.tsx` | `metadataBase: new URL(siteUrl)` (Open Graph, canonical) | Coerência de OG e links canônicos com o domínio real (www). |
| `src/app/produtos/[slug]/page.tsx` | `absoluteUrl(product.images[0])` em metadata e JSON-LD | Imagens absolutas corretas para o domínio www. |

Conclusão: **todo o fluxo Stripe (redirects e imagem no Checkout) depende de `NEXT_PUBLIC_SITE_URL`**. Para **<https://www.phoenixglobal.com.br>**, essa variável **precisa** ser `https://www.phoenixglobal.com.br` no ambiente **Production** da Vercel.

---

## 3. Verificação no código

### 3.1 API de checkout

- **Rota:** `POST /api/checkout`
- **Condição para funcionar:** `checkStripeEnv().stripeReady === true` (ou seja, `STRIPE_SECRET_KEY` definida, length ≥ 20, sem placeholder `...`).
- **Uso do domínio:** `getBaseUrl()` é chamado uma vez; o valor é usado em:
  - `success_url`
  - `cancel_url`
  - `product_data.images[0]` (URL absoluta da imagem).

Não há hardcode de domínio na rota; tudo vem de `getBaseUrl()` → `NEXT_PUBLIC_SITE_URL`.

### 3.2 Cliente (Botão "Pagar com cartão")

- **Componente:** `src/components/checkout/BotaoPagarCartao.tsx`
- **Ação:** `fetch("/api/checkout", { method: "POST", body: JSON.stringify({ slug, quantity }) })`.
- **Redirect:** `window.location.href = data.url` (página do Stripe).

O front usa URL relativa `/api/checkout`, então a requisição vai sempre para o mesmo host em que o usuário está (ex.: <https://www.phoenixglobal.com.br>). Não há dependência de domínio no cliente além disso.

### 3.3 Fallback no código

Em `src/lib/env.ts`:

```ts
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br"; // fallback sem www
```

O fallback é **sem www**. Por isso:

- Em **produção na Vercel** a variável **deve** estar definida.
- Para o site em **<https://www.phoenixglobal.com.br>**, o valor deve ser `https://www.phoenixglobal.com.br` (sem barra final; o código já faz `.replace(/\/$/, "")`).

---

## 4. Stripe Dashboard (domínio e redirects)

- O Stripe Checkout **não** exige whitelist de domínio para `success_url` e `cancel_url` na criação da sessão.
- Os redirects são exatamente as URLs que você envia em `success_url` e `cancel_url`; portanto, desde que `NEXT_PUBLIC_SITE_URL` esteja correto na Vercel, o redirect para **<https://www.phoenixglobal.com.br>** será correto.
- Não é necessário configurar **<https://www.phoenixglobal.com.br>** em nenhuma tela específica do Stripe para esse fluxo (Checkout hospedado pela Stripe).

---

## 5. Checklist: Stripe funcional (www)

### Na Vercel (Production)

- [ ] **NEXT_PUBLIC_SITE_URL** = `https://www.phoenixglobal.com.br` (exatamente, sem barra no final).
- [ ] **STRIPE_SECRET_KEY** = chave secreta Stripe (`sk_live_...` ou `sk_test_...`), sem placeholder.
- [ ] Variáveis aplicadas ao ambiente **Production** (e, se usar, Preview).
- [ ] **Redeploy** do deployment de produção após alterar variáveis.

### Domínio e DNS

- [ ] **<https://www.phoenixglobal.com.br>** configurado em **Settings → Domains** do projeto na Vercel.
- [ ] DNS do domínio apontando para a Vercel conforme instruções do painel (CNAME ou A/AAAA).

### Teste manual (www)

1. Abrir **<https://www.phoenixglobal.com.br>** e ir a um produto (ex.: AirPods 4).
2. Clicar em **"Pagar com cartão"**.
3. Verificar que:
   - Não aparece a mensagem "Pagamento temporariamente indisponível...".
   - A página do Stripe Checkout abre.
   - A imagem do produto no Checkout carrega (URL absoluta usa `baseUrl`).
4. Após **sucesso** ou **cancelar**, verificar que o redirect volta para:
   - **<https://www.phoenixglobal.com.br/produtos/[slug]?pagamento=sucesso>** ou
   - **<https://www.phoenixglobal.com.br/produtos/[slug]?pagamento=cancelado>**  
   (ou seja, **www**, não outro host nem <https://phoenixglobal.com.br> sem www).
5. Na página de produto, o banner de "Pagamento concluído" ou "Pagamento cancelado" deve aparecer (componente `PaymentStatusBanner`).

---

## 6. Resumo

| Requisito | Status (domínio www) |
| --------- | -------------------- |
| Código usa `getBaseUrl()` para success/cancel e imagem | Sim, em `api/checkout/route.ts` |
| `getBaseUrl()` lê `NEXT_PUBLIC_SITE_URL` | Sim, em `src/lib/env.ts` |
| Fallback no código | <https://phoenixglobal.com.br> (sem www) — por isso a env é obrigatória em produção para www |
| Stripe exige whitelist de domínio para redirect? | Não, para Checkout hospedado pela Stripe |
| Condição para "Pagar com cartão" responder 200 | `STRIPE_SECRET_KEY` válida em Production |

Para o Stripe estar **devidamente funcional** no domínio **<https://www.phoenixglobal.com.br>**:

1. **NEXT_PUBLIC_SITE_URL** = <https://www.phoenixglobal.com.br> na Vercel (Production).
2. **STRIPE_SECRET_KEY** configurada na Vercel (Production).
3. Domínio **<https://www.phoenixglobal.com.br>** ativo no projeto Vercel e com DNS correto.
4. Deployment de produção feito **depois** de configurar as variáveis (redeploy se necessário).

Com isso, o fluxo de pagamento com cartão (abertura do Checkout, imagem do produto e redirect pós-pagamento) fica correto para **<https://www.phoenixglobal.com.br>**.
