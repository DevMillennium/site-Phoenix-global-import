# Plano de Integração — Site Phoenix Imports ↔ PAIOS

> Arquitetura desacoplada: site nunca expõe tokens; PAIOS orquestra; Fernanda atende.

---

## Arquitetura adotada (Opção C híbrida)

```
┌─────────────────────────────────────────────────────────────┐
│  Site Phoenix Imports (Next.js / Vercel)                    │
│  • Catálogo local (products.ts)                             │
│  • GET /api/products* (público)                             │
│  • GET /api/internal/catalog (PAIOS pull, autenticado)      │
│  • POST /api/leads (captura + forward)                      │
│  • CTAs WhatsApp com contexto Fernanda                      │
└───────────────┬─────────────────────────────┬───────────────┘
                │ sale.completed / lead.created │ catalog pull
                ▼                               ▼
┌───────────────────────────────────────────────────────────────┐
│  PAIOS — Central de Operações Autônomas (:3050)               │
│  • Commercial Intelligence (leads, scoring)                   │
│  • Oracle Pro (inventory sync)                              │
│  • Sites Cockpit (monitor RO)                                 │
│  • Argus / Kronos / Nexus                                   │
└───────────────┬───────────────────────────────────────────────┘
                │ read-only bridge (Sprint 7+ write supervisionado)
                ▼
┌───────────────────────────────────────────────────────────────┐
│  Fernanda — phoenix-fast-reply-agent (:3030)                  │
│  WhatsApp · Instagram · Facebook · inbox omnichannel            │
└───────────────────────────────────────────────────────────────┘
```

---

## Fases e status

| Fase | Entrega | Status |
|------|---------|--------|
| 0 | Baseline + auditoria | ✅ |
| 1 | Mapeamento site | ✅ |
| 2 | Mapeamento PAIOS/agentes | ✅ |
| 3 | Estoque / modelo produto | ✅ estrutura |
| 4 | Arquitetura definida | ✅ |
| 5 | CTAs inteligentes Fernanda | ✅ P0 PDP |
| 6 | API produtos + leads | ✅ P0 |
| 7 | Integração Fernanda via PAIOS webhook | ✅ lead.created |
| 8 | Dashboard alinhado | ✅ read-only cockpit |
| 9 | Segurança | ✅ sem tokens no client |
| 10 | SEO/conversão | ✅ mantido (sem regressão visual) |
| 11 | Implementação incremental | 🔄 P0 feito |
| 12 | Testes | 🔄 build OK |
| 13 | Documentação | ✅ |
| 14 | Branch + push | 🔄 |

---

## P0 — Implementado nesta branch

1. `POST /api/leads` — validação, rate limit, forward PAIOS  
2. `GET /api/products`, `/featured`, `/[slug]` — catálogo público  
3. CTAs PDP: Comprar WA, Consultar disponibilidade, Falar com Fernanda  
4. Mensagens comerciais alinhadas (`src/lib/product-cta.ts`)  
5. Registro lead fire-and-forget no clique WhatsApp (`register-lead.ts`)  
6. `emitPaiosLeadCreated` em `paios-webhook.ts`  
7. Documentação completa  

---

## P1 — Próximos passos

1. **Configurar Vercel env em produção**
   - `PAIOS_WEBHOOK_URL` → URL pública PAIOS (tunnel ou meta.phoenixglobalholding.com)
   - `PAIOS_WEBHOOK_SECRET` → igual ao PAIOS `.env`
   - `PAIOS_CATALOG_SYNC_SECRET` → para sync Oracle

2. **Validar fluxo end-to-end**
   ```bash
   # PAIOS local
   cd "~/Desktop/central de operacoes autonomas" && npm run dev:all
   # Sync catálogo
   npm run sync:catalog
   # Testar lead
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{"productSlug":"sony-zv-e10","productName":"Sony ZV-E10","intent":"product_interest"}'
   ```

3. **LaunchAgent sync catálogo** (PAIOS) — `scripts/install-catalog-sync-launchagent.sh`

4. **Shyr → `/api/leads`** quando conversa indicar interesse em produto

5. **Argus monitor** — catalog 401, webhook silence > 24h

---

## P2 — Backlog

- Checkout e-commerce completo
- Pagamento Pix integrado
- Painel admin produtos no site
- CTAs Instagram Direct
- Campanhas Apollo ↔ landing UTM
- Escrita supervisionada Fernanda (Sprint 7 gate)

---

## Variáveis de ambiente necessárias

### Site (Vercel)

| Variável | Uso |
|----------|-----|
| `PAIOS_WEBHOOK_URL` | Base URL API PAIOS |
| `PAIOS_WEBHOOK_SECRET` | Auth webhook |
| `PAIOS_CATALOG_SYNC_SECRET` | Pull catálogo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | CTAs |
| `STRIPE_*` | Checkout (existente) |
| `DEEPSEEK_API_KEY` | Shyr (existente) |

### PAIOS

| Variável | Uso |
|----------|-----|
| `PAIOS_WEBHOOK_SECRET` | Receptor webhooks |
| `FERNANDA_API_URL` | Bridge Fernanda |
| `IMPORT_SITE_REPO` | Fallback sync local |

---

## Regras de regressão

- Não remover páginas ou CTAs existentes
- Não alterar identidade visual sem mapeamento
- Não merge automático no `main`
- Toda escrita externa via PAIOS supervisionado (Sprint 7+)
- Estoque Oracle nunca substituído automaticamente pelo site
