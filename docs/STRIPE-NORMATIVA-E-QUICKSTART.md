# Stripe — Normativa e Quickstart no projeto Phoenix Global

Este documento alinha a integração do site com a **normativa oficial Stripe** e os guias [Checkout quickstart](https://docs.stripe.com/checkout/quickstart) e [Authentication](https://docs.stripe.com/api/authentication).

---

## 1. Autenticação (API Keys)

Conforme [Stripe Authentication](https://docs.stripe.com/api/authentication):

- **Secret key** (`sk_test_` ou `sk_live_`): usar **apenas no servidor** (API routes). Nunca em código cliente nem em repositório.
- **Publishable key** (`pk_test_` ou `pk_live_`): pode ser usada no front (ex.: Stripe.js). Não é obrigatória quando o fluxo é só redirect para Stripe Checkout.

No projeto:

- `STRIPE_SECRET_KEY` é lida somente em `src/app/api/checkout/route.ts` (servidor).
- O `env-check` exige que a chave tenha prefixo `sk_test_` ou `sk_live_` e rejeita `pk_` para evitar uso incorreto da Publishable key.

**Onde obter:** [Dashboard Stripe → API Keys](https://dashboard.stripe.com/apikeys) (ou [login](https://dashboard.stripe.com/login) → Developers → API keys).

---

## 2. Checkout (fluxo no projeto)

Conforme [Stripe Checkout quickstart](https://docs.stripe.com/checkout/quickstart):

| Recomendação Stripe | Implementação no projeto |
|---------------------|---------------------------|
| Criar Checkout Session no servidor | `POST /api/checkout` em `src/app/api/checkout/route.ts` |
| `mode: "payment"` para pagamento único | Definido na criação da sessão |
| `line_items` com `price_data` ou Price ID | Uso de `price_data` com valor em centavos (BRL) |
| `success_url` acessível publicamente | `${baseUrl}/produtos/${slug}?pagamento=sucesso&session_id={CHECKOUT_SESSION_ID}` |
| `cancel_url` | `${baseUrl}/produtos/${slug}?pagamento=cancelado` |
| Redirecionar o cliente para `session.url` | Cliente faz `window.location.href = data.url` após receber a URL da API |

O Stripe substitui `{CHECKOUT_SESSION_ID}` na `success_url` pelo ID real da sessão (útil para futura confirmação de pedido ou webhooks).

---

## 3. Variáveis de ambiente

| Variável | Uso | Onde definir |
|---------|-----|--------------|
| `STRIPE_SECRET_KEY` | Criação da Checkout Session (servidor) | `.env.local` (dev) e **Vercel → Settings → Environment Variables** (Production) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Opcional (Stripe.js no front) | Idem, se for usar |

Em produção, após alterar variáveis na Vercel, é necessário **Redeploy** do projeto.

---

## 4. Checklist de conformidade

- [x] Secret key só no servidor (API route).
- [x] Validação de env com prefixo `sk_` em `src/lib/env-check.ts`.
- [x] Checkout Session com `mode: "payment"`, `currency: "brl"`, `price_data`, `success_url` e `cancel_url`.
- [x] Redirecionamento do cliente para a URL retornada pelo Stripe.
- [x] Página de retorno com feedback (sucesso/cancelado) via `PaymentStatusBanner` e query `?pagamento=sucesso|cancelado`.

---

## 5. Referências oficiais

- [Build a Stripe-hosted checkout page](https://docs.stripe.com/checkout/quickstart)
- [Authentication (API keys)](https://docs.stripe.com/api/authentication)
- [Stripe Dashboard (API keys)](https://dashboard.stripe.com/apikeys)
- [Stripe Dashboard (login)](https://dashboard.stripe.com/login)

Para dados de deploy e Vercel: [DADOS-STRIPE-E-VERCEL.md](./DADOS-STRIPE-E-VERCEL.md).
