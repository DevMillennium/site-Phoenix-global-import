# Verificação: Stripe, Vercel e Componentes Relacionados

Este documento consolida a análise das configurações do **Stripe**, **Vercel** e dos **componentes** que dependem delas, para garantir que tudo está devidamente funcional.

---

## 1. STRIPE

### 1.1 Variáveis de ambiente

| Variável | Obrigatória | Onde é usada | Efeito se faltar |
|----------|-------------|--------------|-------------------|
| `STRIPE_SECRET_KEY` | **Sim** (para checkout) | `api/checkout/route.ts`, `lib/env-check.ts`, `lib/stripe-server.ts` | Botão "Pagar com cartão" retorna 503; mensagem "Pagamento temporariamente indisponível" |

- **Formato:** Secret key do Stripe (`sk_test_...` ou `sk_live_...`), nunca Publishable (`pk_...`).
- **Onde obter:** [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys).

### 1.2 Fluxo de checkout (verificado)

1. **Cliente:** `BotaoPagarCartao` chama `POST /api/checkout` com `{ slug, quantity }`.
2. **API:**  
   - Chama `checkStripeEnv()`; se `!stripeReady` → 503.  
   - Lê `process.env.STRIPE_SECRET_KEY` (após checagem).  
   - Busca produto por `slug`, obtém `getBaseUrl()` e `absoluteUrl()` de `@/lib/env`.  
   - Cria sessão Stripe com `currency: "brl"`, `success_url`, `cancel_url` e imagem do produto via `absoluteUrl(product.images[0])`.  
   - Responde `{ url: session.url }`.
3. **Cliente:** redireciona com `window.location.href = data.url`.
4. **Stripe:** usuário paga ou cancela; redirect para `success_url` ou `cancel_url`.
5. **Site:** `PaymentStatusBanner` lê `?pagamento=sucesso|cancelado` e exibe feedback.

**URLs do Stripe (dependem de `NEXT_PUBLIC_SITE_URL`):**

- `success_url`: `${baseUrl}/produtos/${slug}?pagamento=sucesso&session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `${baseUrl}/produtos/${slug}?pagamento=cancelado`
- Imagem do produto no Checkout: `absoluteUrl(product.images[0])` (baseUrl + path)

### 1.3 Validação da chave (`lib/env-check.ts`)

- `checkStripeEnv()` exige:
  - Tipo string, length ≥ 20
  - Prefixo `sk_test_` ou `sk_live_`
  - Sem placeholder `...`
- Se for `pk_`, retorna mensagem orientando usar Secret key.

### 1.4 Código ajustado nesta verificação

- **`api/checkout/route.ts`:** uso de `absoluteUrl(product.images[0])` para a imagem do produto no Checkout (consistente com OG/JSON-LD).
- **`stripe-server.ts`:** módulo opcional (singleton Stripe); a rota de checkout não depende dele e instancia Stripe diretamente com `STRIPE_SECRET_KEY`.

### 1.5 Checklist Stripe

- [ ] `STRIPE_SECRET_KEY` definida na Vercel (Production) com valor real (não placeholder).
- [ ] Valor começa com `sk_live_` ou `sk_test_`.
- [ ] Em produção, após configurar, fazer **Redeploy** do projeto na Vercel.
- [ ] Testar "Pagar com cartão" em um produto: deve abrir a página do Stripe Checkout (não 503).

---

## 2. VERCEL

### 2.1 Variáveis de ambiente (produção)

| Variável | Obrigatória | Uso no projeto |
|----------|-------------|----------------|
| `NEXT_PUBLIC_SITE_URL` | **Sim** | Sitemap, robots, layout (metadataBase), OG/JSON-LD, **success_url/cancel_url e imagem do Stripe** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | **Sim** | Todos os links `wa.me` (Footer, Contato, Carrinho, PDP) |
| `STRIPE_SECRET_KEY` | **Sim** (checkout) | API `/api/checkout` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Não | Não usado no fluxo atual (redirect Checkout) |

**Regra:** `NEXT_PUBLIC_SITE_URL` deve ser **exatamente** a URL pela qual o site é acessado (ex.: `https://www.phoenixglobal.com.br` ou `https://phoenixglobal.com.br`), **sem barra final**.

### 2.2 Onde cada variável é lida

| Arquivo | Variável | Uso |
|---------|----------|-----|
| `src/lib/env.ts` | `NEXT_PUBLIC_SITE_URL` | `getBaseUrl()`, `absoluteUrl()` |
| `src/lib/env.ts` | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `getWhatsAppNumber()`, `getWhatsAppLink()` |
| `src/app/layout.tsx` | `NEXT_PUBLIC_SITE_URL` | `metadataBase` |
| `src/app/sitemap.ts` | `NEXT_PUBLIC_SITE_URL` | URLs do sitemap |
| `src/app/robots.ts` | `NEXT_PUBLIC_SITE_URL` | URL do sitemap em robots |
| `src/app/api/checkout/route.ts` | `getBaseUrl()`, `absoluteUrl()` | success_url, cancel_url, imagem produto |
| `src/app/produtos/[slug]/page.tsx` | `absoluteUrl()`, `getWhatsAppLink()` | OG, JSON-LD, link WhatsApp |
| Footer, Contato, Carrinho, etc. | `getWhatsAppLink()` | Links wa.me |

### 2.3 Scripts de integração com a Vercel

- **`npm run vercel:env`** (`scripts/enviar-env-vercel.js`):  
  - Lê `.env.local` e envia para a Vercel as chaves: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (apenas as que existirem no arquivo).  
  - Marca como `secret` a chave do Stripe.  
  - Define target `production` e `preview`.  
  - Requer `VERCEL_TOKEN` e `VERCEL_PROJECT` (ou `.vercel/project.json` após `vercel link`).  
  - Opcionalmente dispara redeploy do último deployment de produção (API v6 list + v13 redeploy).

- **`npm run vercel:check`** (`scripts/verificar-env-vercel.js`):  
  - Consulta a API da Vercel e verifica se as variáveis obrigatórias estão configuradas para Production.  
  - Chaves secretas (ex.: `STRIPE_SECRET_KEY`) não aparecem na API; o script considera OK se a chave estiver no `.env.local` e orienta rodar `vercel:env` + Redeploy.

### 2.4 Checklist Vercel

- [ ] Em **Vercel → Project → Settings → Environment Variables**:  
  - [ ] `NEXT_PUBLIC_SITE_URL` = URL canônica do site (com ou sem www).  
  - [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` = DDI + DDD + número (ex.: `5585994482323`).  
  - [ ] `STRIPE_SECRET_KEY` = chave secreta Stripe (pode ser marcada como Secret).  
- [ ] Variáveis aplicadas ao ambiente **Production** (e Preview se desejar).  
- [ ] Após alterar env, fazer **Redeploy** do deployment de Production.  
- [ ] Opcional: usar `npm run vercel:check` (e, se necessário, `npm run vercel:env`) antes do deploy.

---

## 3. COMPONENTES E MÓDULOS RELACIONADOS

### 3.1 `src/lib/env.ts`

- **Funções:** `getBaseUrl()`, `getWhatsAppNumber()`, `getWhatsAppLink(message)`, `absoluteUrl(path)`.
- **Fallbacks:** `NEXT_PUBLIC_SITE_URL` → `https://phoenixglobal.com.br`; `NEXT_PUBLIC_WHATSAPP_NUMBER` → número padrão (apenas para desenvolvimento/local).
- **Status:** Única fonte de verdade para URL do site e número WhatsApp; usado em toda a aplicação.

### 3.2 `src/lib/env-check.ts`

- **Funções:** `checkSiteEnv()` (SITE_URL + WHATSAPP), `checkStripeEnv()` (STRIPE_SECRET_KEY).
- **Uso:** `checkStripeEnv()` é chamado em `api/checkout/route.ts` antes de criar a sessão Stripe.
- **Status:** Nomes das chaves alinhados com `.env.example` e scripts Vercel (`STRIPE_SECRET_KEY`, etc.).

### 3.3 `src/lib/stripe-server.ts`

- **Função:** `getStripe()` — singleton do cliente Stripe usando `STRIPE_SECRET_KEY`.
- **Uso:** Não é usado pela rota de checkout (ela instancia Stripe diretamente). Útil para outros fluxos server-side (ex.: webhooks futuros).
- **Status:** Opcional para o fluxo atual; não quebra se a chave não estiver definida (retorna `null`).

### 3.4 `BotaoPagarCartao` (`src/components/checkout/BotaoPagarCartao.tsx`)

- Chama `POST /api/checkout` com `{ slug, quantity }`.
- Trata 503 (Stripe não configurado), 4xx/5xx e redireciona para `data.url` quando sucesso.
- Exibe loading e mensagem de erro com `role="alert"`.
- **Status:** Funcional; depende de `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_SITE_URL` na API.

### 3.5 `PaymentStatusBanner` (`src/components/checkout/PaymentStatusBanner.tsx`)

- Lê `?pagamento=sucesso|cancelado` na URL e exibe o banner correspondente.
- Remove o parâmetro após 8s ou ao fechar.
- **Status:** Funcional; depende apenas das URLs de redirect configuradas no checkout (logo de `NEXT_PUBLIC_SITE_URL`).

### 3.6 `LinkWhatsApp` (`src/components/checkout/LinkWhatsApp.tsx`)

- Recebe `href` (geralmente de `getWhatsAppLink(...)`).
- Se `href` inválido ou não for `https://wa.me/`, usa **fallback** com `getWhatsAppLink("Olá! Gostaria de mais informações.")` (número e URL vêm do env).
- **Ajuste nesta verificação:** Fallback passou a usar `getWhatsAppLink()` em vez de número fixo, mantendo consistência com `NEXT_PUBLIC_WHATSAPP_NUMBER`.

### 3.7 Demais usos de WhatsApp e URL

- **Footer, Contato, Carrinho, PDP:** usam `getWhatsAppLink(...)` de `@/lib/env` — todos consistentes com o env.
- **OG e JSON-LD (produto):** usam `absoluteUrl(product.images[0])` — consistente com `NEXT_PUBLIC_SITE_URL`.

---

## 4. RESUMO E AÇÕES

### O que foi verificado e está correto

- Uso de `STRIPE_SECRET_KEY` apenas no servidor (rota API e env-check).
- `success_url` e `cancel_url` e imagem do Checkout usam `getBaseUrl()` / `absoluteUrl()` (NEXT_PUBLIC_SITE_URL).
- Nomes das variáveis alinhados entre `.env.example`, `env-check.ts`, scripts Vercel e documentação.
- LinkWhatsApp e checkout passaram a usar de forma consistente `getWhatsAppLink` e `absoluteUrl`.

### Ajustes feitos nesta verificação

1. **`LinkWhatsApp`:** fallback do link passa a usar `getWhatsAppLink()` em vez de número fixo.
2. **`api/checkout/route.ts`:** imagem do produto no Stripe Checkout passou a usar `absoluteUrl(product.images[0])`.

### O que você deve garantir em produção

1. **Vercel → Environment Variables (Production):**  
   - `NEXT_PUBLIC_SITE_URL` = URL canônica do site.  
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = número com DDI.  
   - `STRIPE_SECRET_KEY` = Secret key do Stripe (`sk_...`).

2. **Após alterar env:** Redeploy do deployment de Production.

3. **Testes manuais:**  
   - Abrir um produto → "Pagar com cartão" → deve abrir o Stripe Checkout; após pagar/cancelar, voltar ao site com `?pagamento=sucesso` ou `?pagamento=cancelado` e banner correto.  
   - Clicar em qualquer link "WhatsApp" e conferir número e mensagem.

Com isso, as configurações do Stripe, da Vercel e dos componentes relacionados estão alinhadas e devidamente funcional quando as variáveis de ambiente forem definidas corretamente em produção.
