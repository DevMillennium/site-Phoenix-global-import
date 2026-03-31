# Fase 3 - Escala, funil e mensuracao real

## Objetivo

Levar o projeto para operacao orientada por dados reais em producao, sem regressao de fluxo atual de compra.

## Implementacoes desta fase

- Integracao de analytics por variaveis reais do projeto:
  - `NEXT_PUBLIC_GTM_ID` (prioridade)
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (fallback quando GTM nao estiver definido)
- Tracking automatico de pageview em mudanca de rota.
- Eventos de e-commerce e conversao:
  - `add_to_cart`
  - `begin_checkout`
  - `checkout_error`
  - `purchase_success`
  - `purchase_cancelled`
  - `whatsapp_click`
- Dedupe de evento de pagamento por sessao para evitar contagem duplicada.

## Arquivos principais

- `src/components/analytics/AnalyticsScripts.tsx`
- `src/components/analytics/AnalyticsPageViewTracker.tsx`
- `src/lib/analytics-env.ts`
- `src/lib/analytics.ts`
- `src/components/layout/ClientLayout.tsx`
- `src/components/checkout/PaymentStatusBanner.tsx`

## Como operar com as chaves ja existentes

1. Mantenha no ambiente de producao os dominios e chaves ja configurados.
2. Defina `NEXT_PUBLIC_GTM_ID` para usar GTM como camada principal.
3. Se nao usar GTM, defina `NEXT_PUBLIC_GA_MEASUREMENT_ID` para GA4 direto.
4. Publicar/redeploy e validar no navegador:
   - pageview em navegacao
   - cliques de CTA
   - inicio de checkout
   - sucesso/cancelamento de pagamento
   - cliques de WhatsApp

## Sem regressao funcional

- Checkout Stripe, carrinho e links WhatsApp foram preservados.
- Eventos sao adicionados de forma complementar e opcional por env.
- Sem dependencia nova e sem alterar fluxo de pagamento existente.
