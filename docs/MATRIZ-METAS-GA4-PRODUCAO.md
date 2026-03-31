# Matriz de Metas GA4 (Producao)

## Objetivo

Padronizar o funil de conversao da Phoenix Global Import no GA4 com metas claras para operacao diaria de CRO.

## Eventos ja instrumentados no projeto

- `page_view`
- `cta_click`
- `add_to_cart`
- `begin_checkout`
- `checkout_error`
- `purchase_success`
- `purchase_cancelled`
- `whatsapp_click`

## Matriz de metas (prioridade)

| Meta | Evento GA4 | Tipo | Regra recomendada | KPI inicial |
|---|---|---|---|---|
| Conversao principal de venda | `purchase_success` | Primaria | Contar 1 por sessao de checkout | Taxa de compra > 2,5% |
| Conversao principal de intencao comercial | `whatsapp_click` | Primaria | Filtrar `action` de compra/cotacao | CTR WhatsApp > 4% |
| Inicio de pagamento | `begin_checkout` | Secundaria | Separar por `source` (`pdp`/`cart`) | Taxa de inicio checkout > 8% |
| Adicao ao carrinho | `add_to_cart` | Secundaria | Contar por item e pagina de produto | Add-to-cart rate > 10% |
| Clique em CTA estrategico | `cta_click` | Secundaria | Separar por `source` da home/pdp | CTR Hero > 8% |
| Queda de pagamento | `purchase_cancelled` | Diagnostico | Monitorar por pagina e sessao | Reduzir cancelamento semana a semana |
| Erro de checkout | `checkout_error` | Diagnostico | Alertar quando subir acima da media | < 1% das tentativas |

## Parametros importantes para analise

- `source`: origem do evento (`home_hero`, `home_final_cta`, `pdp`, `cart`, etc.)
- `action`: intencao do usuario (ex.: `solicitar_cotacao`, `comprar_whatsapp`)
- `destination`: destino do CTA
- `item_slug`, `item_name`, `quantity`, `value`, `currency`
- `session_id` (retorno de pagamento)
- `page_path`, `page_location`

## Configuracao no GA4 (passo a passo)

1. Acesse `Administrador -> Eventos`.
2. Verifique se os eventos acima estao chegando no Realtime/DebugView.
3. Em `Administrador -> Conversoes`, marque como conversao:
   - `purchase_success`
   - `whatsapp_click`
4. (Opcional recomendado) Marque tambem:
   - `begin_checkout`
   - `add_to_cart`
5. Em `Administrador -> Definicoes personalizadas`, criar dimensoes para:
   - `source`
   - `action`
   - `destination`
   - `item_slug`
6. Validar novamente no DebugView executando fluxo real:
   - Home -> Produto -> Add to cart -> Begin checkout -> retorno com `pagamento=sucesso`.

## Configuracao no GTM (se GTM for o canal principal)

1. Criar tag GA4 Configuration (ou Google tag) com seu Measurement ID.
2. Criar trigger de eventos personalizados para cada evento recebido no `dataLayer`.
3. Publicar container.
4. Validar em `Preview` se cada evento dispara a tag correta.

## Painel minimo recomendado (GA4 Explorations)

Crie uma exploracao de funil com estas etapas:

1. `page_view` (home)
2. `cta_click` (`source=home_hero` ou `home_final_cta`)
3. `add_to_cart`
4. `begin_checkout`
5. `purchase_success`

Quebras essenciais:

- por dispositivo (mobile/desktop)
- por origem (`source`)
- por pagina (`page_path`)

## Operacao semanal (ritmo)

- Segunda: revisar funil e gargalos da semana anterior.
- Quarta: publicar 1 experimento de CTA/headline.
- Sexta: consolidar impacto e decidir manter/reverter.

## Alertas operacionais

- Se `checkout_error` subir abruptamente, validar API `/api/checkout` e status Stripe.
- Se `begin_checkout` cair e `add_to_cart` ficar estavel, revisar botoes de pagamento.
- Se `whatsapp_click` cair na home, testar variacao de copy e ordem de secoes.

## Execucao rapida

- Checklist de implantacao: `docs/CHECKLIST-IMPLANTACAO-GA4-GTM-10MIN.md`
