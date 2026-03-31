# Checklist de Implantacao GA4/GTM (10 min)

Use este checklist para validar rapidamente a telemetria em producao.

## 1) Ambiente (1 min)

- [ ] A versao mais recente esta publicada em producao.
- [ ] Variavel definida: `NEXT_PUBLIC_GTM_ID` **ou** `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Dominio canonico esta correto (`phoenixglobal.com.br`).

Criterio de aceite:

- [ ] Site carregando normalmente em aba anonima.

## 2) GTM Preview (2 min)

- [ ] Abrir GTM -> Preview (Tag Assistant).
- [ ] Conectar no dominio de producao.
- [ ] Navegar: Home -> Produtos -> PDP -> Carrinho -> Contato.
- [ ] Confirmar eventos no fluxo:
  - [ ] `page_view`
  - [ ] `cta_click`
  - [ ] `add_to_cart`
  - [ ] `begin_checkout`
  - [ ] `whatsapp_click`

Criterio de aceite:

- [ ] Eventos aparecem no Preview sem erro de tag.

## 3) GA4 Realtime/DebugView (3 min)

- [ ] Abrir GA4 -> Realtime.
- [ ] Executar clique de CTA na Home.
- [ ] Adicionar item no carrinho.
- [ ] Iniciar checkout pelo PDP ou carrinho.
- [ ] Abrir GA4 -> DebugView.
- [ ] Confirmar recebimento com parametros:
  - [ ] `source`
  - [ ] `action`
  - [ ] `destination` (quando aplicavel)
  - [ ] `item_slug` (quando aplicavel)

Criterio de aceite:

- [ ] Eventos chegando em tempo real no GA4.

## 4) Conversoes no GA4 (2 min)

- [ ] Em Administrador -> Conversoes, marcar:
  - [ ] `purchase_success`
  - [ ] `whatsapp_click`
- [ ] (Opcional recomendado)
  - [ ] `begin_checkout`
  - [ ] `add_to_cart`

Criterio de aceite:

- [ ] Conversoes ativas e visiveis na lista de eventos.

## 5) Validacao de pagamento (2 min)

- [ ] Rodar fluxo de checkout e retornar com `pagamento=sucesso` **ou** `pagamento=cancelado`.
- [ ] Validar evento correspondente:
  - [ ] `purchase_success` ou `purchase_cancelled`
- [ ] Recarregar a pagina de retorno e confirmar sem duplicacao de compra.

Criterio de aceite:

- [ ] Sem regressao no checkout e sem evento duplicado de pagamento.

## 6) Fechamento operacional (menos de 1 min)

- [ ] Registrar resultado da validacao (data/hora/responsavel).
- [ ] Se houver falha, abrir acao imediata com prioridade:
  - P0: checkout/compra
  - P1: begin_checkout/add_to_cart
  - P2: cta_click/whatsapp_click

---

## Resultado final

Marque um status:

- [ ] **Aprovado para operacao de CRO**
- [ ] **Aprovado com ressalvas**
- [ ] **Reprovado (exige correcao antes de campanha)**
