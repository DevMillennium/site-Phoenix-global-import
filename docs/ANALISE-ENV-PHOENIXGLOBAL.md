# Análise detalhada — Stripe, Vercel e domínio phoenixglobal.com.br

Este documento confere **todos os elementos** necessários para o funcionamento real do site quando acessado em **phoenixglobal.com.br**.

---

## 1. Variáveis obrigatórias na Vercel (Production)

Para o site em **<https://phoenixglobal.com.br>** (ou **<https://www.phoenixglobal.com.br>**) funcionar de ponta a ponta, as variáveis abaixo **precisam existir** no projeto na Vercel, com escopo **Production** (e, se quiser, Preview).

| Variável | Obrigatório | Uso no código | Impacto se faltar |
| -------- | ----------- | ------------- | ----------------- |
| **NEXT_PUBLIC_SITE_URL** | Sim | `src/lib/env.ts`, `layout.tsx`, `sitemap.ts`, `robots.ts`, `api/checkout/route.ts`, `produtos/[slug]/page.tsx` (OG/JSON-LD) | URLs erradas no sitemap, OG, redirect do Stripe e imagens; metadataBase incorreto |
| **NEXT_PUBLIC_WHATSAPP_NUMBER** | Sim | `src/lib/env.ts` → `getWhatsAppLink()`; usado em Footer, Contato, Carrinho, PDP | Todos os links wa.me quebrados ou com número errado |
| **STRIPE_SECRET_KEY** | Sim | `src/app/api/checkout/route.ts`, `src/lib/env-check.ts`, `src/lib/stripe-server.ts` | Botão "Pagar com cartão" retorna 503; mensagem "Pagamento temporariamente indisponível" |
| **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** | Opcional* | Não usado hoje no código (fluxo é redirect para Stripe Checkout) | Nenhum no fluxo atual; útil se no futuro usar Stripe.js no cliente |

\* O script `vercel:env` envia se existir no `.env.local`; não quebra nada ter na Vercel.

---

## 2. Onde cada variável é usada (referência técnica)

### NEXT_PUBLIC_SITE_URL (baseUrl / siteUrl)

- **`src/lib/env.ts`**  
  - `getBaseUrl()` → usado pela API de checkout e por `absoluteUrl()`.  
  - Fallback: <https://phoenixglobal.com.br>.
- **`src/app/layout.tsx`**  
  - `metadataBase: new URL(siteUrl)` → Open Graph e URLs canônicas.
- **`src/app/sitemap.ts`**  
  - Geração de todas as URLs do sitemap (home, produtos, contato, sobre, carrinho, páginas de produto).
- **`src/app/robots.ts`**  
  - `sitemap: ${baseUrl}/sitemap.xml`.
- **`src/app/api/checkout/route.ts`**  
  - `success_url` e `cancel_url` do Stripe: `${baseUrl}/produtos/${slug}?pagamento=sucesso|cancelado`.  
  - URL da imagem do produto no Checkout: `${baseUrl}${product.images[0]}`.
- **`src/app/produtos/[slug]/page.tsx`**  
  - `absoluteUrl(product.images[0])` em `generateMetadata` (OG) e no JSON-LD (Product image).

**Importante para phoenixglobal.com.br:**  
O valor de `NEXT_PUBLIC_SITE_URL` deve ser **exatamente** a URL pela qual o site é acessado em produção:

- Se o domínio principal for **<https://www.phoenixglobal.com.br>** → use `https://www.phoenixglobal.com.br`.
- Se for **<https://phoenixglobal.com.br>** (sem www) → use `https://phoenixglobal.com.br`.

Assim, o redirect do Stripe (sucesso/cancelamento) e os links do sitemap/OG ficam corretos para o domínio real.

---

### NEXT_PUBLIC_WHATSAPP_NUMBER

- **`src/lib/env.ts`**  
  - `getWhatsAppNumber()`, `getWhatsAppLink(message)`.
- **`src/components/layout/Footer.tsx`**  
  - Link “WhatsApp” no rodapé.
- **`src/app/contato/page.tsx`**  
  - Cotação e atendimento.
- **`src/components/cart/CartContent.tsx`**  
  - Carrinho vazio e “Enviar lista no WhatsApp”.
- **`src/app/produtos/[slug]/page.tsx`**  
  - “Comprar no WhatsApp” com nome e preço do produto.

Formato esperado: apenas dígitos, com DDI (ex.: `5585994482323`). Sem `+` ou espaços.

---

### STRIPE_SECRET_KEY

- **`src/app/api/checkout/route.ts`**  
  - Checagem via `checkStripeEnv()`; criação do cliente Stripe e da sessão de Checkout.  
  - Sem essa variável (ou com valor inválido): resposta 503 e mensagem “Pagamento temporariamente indisponível. Configure STRIPE_SECRET_KEY na Vercel (Production).”.
- **`src/lib/env-check.ts`**  
  - `checkStripeEnv()`: exige string, length ≥ 20 e sem `...` (placeholder).
- **`src/lib/stripe-server.ts`**  
  - `getStripe()` usa `process.env.STRIPE_SECRET_KEY` (a rota de checkout não depende deste módulo; usa a chave direto).

Formato: **Secret key** do Stripe (começa com `sk_live_` ou `sk_test_`). **Não** usar Merchant Key (`mk_...`).

---

## 3. Elementos Vercel necessários (não são env)

Para o site ser acessado em **phoenixglobal.com.br**:

1. **Domínio no projeto**  
   No projeto na Vercel: **Settings → Domains**  
   - Adicionar `phoenixglobal.com.br` e, se usar, `www.phoenixglobal.com.br`.  
   - Configurar no Registro.br (ou onde o domínio está) os registros DNS apontando para a Vercel (conforme instruções da Vercel).

2. **Production Deployment**  
   O deployment de produção deve estar atribuído ao domínio escolhido (ex.: `www.phoenixglobal.com.br` como produção).  
   As variáveis de ambiente listadas acima devem estar definidas para o ambiente **Production** (e, se desejado, Preview).

3. **Redeploy após alterar env**  
   Sempre que alterar variáveis de ambiente na Vercel, é necessário um **Redeploy** do deployment de produção para as funções (por exemplo `/api/checkout`) e o build passarem a usar os novos valores.

---

## 4. Checklist de funcionamento real (phoenixglobal.com.br)

Use este checklist para garantir que tudo está presente e correto.

### Na Vercel (Settings → Environment Variables, Production)

- [ ] **NEXT_PUBLIC_SITE_URL** = `https://phoenixglobal.com.br` ou `https://www.phoenixglobal.com.br` (igual ao domínio que você usa como principal).
- [ ] **NEXT_PUBLIC_WHATSAPP_NUMBER** = número com DDI (ex.: `5585994482323`).
- [ ] **STRIPE_SECRET_KEY** = chave secreta Stripe (`sk_live_...` ou `sk_test_...`), sem placeholder.
- [ ] **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** = opcional; pode ser `pk_live_...` se quiser manter alinhado ao Stripe.

### Domínio e deploy

- [ ] Domínio **phoenixglobal.com.br** (e www, se aplicável) adicionado em **Settings → Domains** e DNS configurado.
- [ ] Após qualquer mudança de env, **Redeploy** do deployment de produção executado.

### Testes rápidos no ar (phoenixglobal.com.br)

- [ ] Abrir **<https://phoenixglobal.com.br>** (ou www) e ver a home.
- [ ] Clicar em “Pagar com cartão” em um produto: deve abrir o Stripe Checkout (não a mensagem “Pagamento temporariamente indisponível”).
- [ ] Após pagamento (ou cancelamento), o redirect deve voltar para **<https://phoenixglobal.com.br/produtos/[slug]?pagamento=sucesso>** (ou cancelado).
- [ ] Links “Comprar no WhatsApp” e “Falar no WhatsApp” abrem o wa.me com o número correto.
- [ ] **<https://phoenixglobal.com.br/sitemap.xml>** lista URLs com o domínio correto.
- [ ] Compartilhar uma página: preview (OG) deve mostrar imagem e URL do domínio correto.

---

## 5. Resumo

| Elemento | Presente no código? | Depende de env na Vercel? | Crítico para phoenixglobal.com.br? |
| -------- | ------------------- | -------------------------- | ----------------------------------- |
| Stripe Checkout (Pagar com cartão) | Sim (`api/checkout`) | **STRIPE_SECRET_KEY** (Production) | Sim |
| Redirect sucesso/cancelamento Stripe | Sim (success_url/cancel_url) | **NEXT_PUBLIC_SITE_URL** = domínio real | Sim |
| Links WhatsApp | Sim (várias páginas) | **NEXT_PUBLIC_WHATSAPP_NUMBER** | Sim |
| Open Graph / metadata / imagens absolutas | Sim (layout, PDP, sitemap) | **NEXT_PUBLIC_SITE_URL** | Sim |
| Sitemap e robots | Sim | **NEXT_PUBLIC_SITE_URL** | Sim |
| Publishable Key Stripe | Não usado no fluxo atual | Opcional | Não |

Para o **funcionamento real** do site em **phoenixglobal.com.br**, é necessário:

1. **Stripe:** `STRIPE_SECRET_KEY` em Production na Vercel (Secret key, não Merchant key).  
2. **Vercel/domínio:** `NEXT_PUBLIC_SITE_URL` igual à URL canônica do site (com ou sem www); `NEXT_PUBLIC_WHATSAPP_NUMBER`; domínio configurado em Domains e redeploy após mudar env.

Com isso, todos os elementos da Stripe e da Vercel usados no projeto estão cobertos para o acesso em phoenixglobal.com.br.
