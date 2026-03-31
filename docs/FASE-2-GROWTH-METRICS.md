# Fase 2 - Growth Metrics e Experimentacao

## Objetivo

Instrumentar eventos de conversao para medir funil real da home e contato, criando base para iteracao orientada por dados.

## O que foi implementado

- Camada de tracking de eventos em `src/lib/analytics.ts`.
- Bridge global de captura de cliques em `src/components/analytics/AnalyticsEventBridge.tsx`.
- Inicializacao da bridge no layout cliente (`ClientLayout`) para cobrir toda a aplicacao.
- Instrumentacao dos CTAs principais da home com `data-track-event` e payload contextual.
- Instrumentacao dos links de WhatsApp da pagina de contato.

## Eventos iniciais

- `cta_click`
  - `source`: origem do CTA (ex.: `home_hero`, `home_final_cta`)
  - `action`: acao especifica do usuario
  - `destination`: destino da navegacao
- `contato_whatsapp_click`
  - `source`: `contato_page`
  - `action`: `abrir_whatsapp_cotacao` ou `abrir_whatsapp_atendimento`

## Leitura recomendada dos dados

- CTR de cada bloco da home por origem (`source`).
- Razao entre clique para cotacao e clique para catalogo.
- Evolucao semanal dos cliques de WhatsApp na pagina de contato.

## Proximos passos da fase 2

1. Conectar os eventos ao provedor oficial (GA4, GTM ou PostHog).
2. Definir painel com funil: Home CTA -> Contato -> WhatsApp.
3. Rodar teste A/B de headline do Hero e CTA principal.
4. Criar metas por evento para validar impacto de cada iteracao.
