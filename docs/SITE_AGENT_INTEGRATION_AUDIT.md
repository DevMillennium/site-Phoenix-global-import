# Auditoria — Integração Site Phoenix Imports ↔ PAIOS / Agentes

> **Data:** 2026-06-18  
> **Branch:** `integrate-site-with-autonomous-agents`  
> **Site:** `site-Phoenix-global-import` (phoenixglobal.com.br)  
> **Sistema de agentes:** `central de operacoes autonomas` (PAIOS — porta 3050)

---

## 1. Stack do site

| Item | Valor |
|------|-------|
| Framework | Next.js 15 (App Router, Turbopack dev) |
| UI | React 19, Tailwind CSS 3.4, Framer Motion |
| Pagamentos | Stripe (checkout API + webhook) |
| Atendimento IA | Shyr — `/api/atendente` (DeepSeek, server-only) |
| Analytics | GTM / GA4 (opcional via env) |
| Deploy | Vercel (phoenixglobal.com.br) |
| Node | >= 20.9.0 |
| Porta dev | 3000 (`npm run dev`) |

### Scripts disponíveis

- `npm run dev` — desenvolvimento
- `npm run build` — build produção ✅ (sem erros no baseline)
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint
- `npm run vercel:env` / `vercel:check` — env Vercel

---

## 2. Páginas e funcionalidades

| Página | Função | Status | Fonte de dados | Integrações | Risco |
|--------|--------|--------|----------------|-------------|-------|
| `/` | Home conversão, hero, destaques | ✅ funcional | `src/data/products.ts` | GA4/GTM, WhatsApp | Baixo |
| `/produtos` | PLP catálogo | ✅ funcional | products.ts | Analytics | Baixo |
| `/produtos/[slug]` | PDP + compra | ✅ funcional | products.ts | Stripe, WhatsApp, leads PAIOS | Médio |
| `/categoria/[slug]` | Filtro por categoria | ✅ funcional | products.ts | — | Baixo |
| `/carrinho` | Carrinho + cross-sell | ✅ funcional | CartContext | Stripe, WhatsApp | Médio |
| `/contato` | Cotação WhatsApp | ✅ funcional | env WhatsApp | Analytics | Baixo |
| `/sobre` | Institucional | ✅ funcional | estático | — | Baixo |
| `/politicas/*` | Envio, troca, privacidade | ✅ funcional | estático | — | Baixo |
| Atendente Shyr | Chat flutuante | ✅ funcional | DeepSeek + catálogo | — | Médio (sem persist lead) |
| `/api/checkout` | Stripe session | ✅ funcional | Stripe | — | Alto |
| `/api/webhooks/stripe` | Venda confirmada | ✅ funcional | Stripe | PAIOS sale.completed | Alto |
| `/api/internal/catalog` | Export catálogo PAIOS | ✅ funcional | products.ts | PAIOS pull | Médio |
| `/api/leads` | Captura lead site | 🧪 novo | POST validado | PAIOS lead.created | Baixo |
| `/api/products` | API pública catálogo | 🧪 novo | products.ts | — | Baixo |

---

## 3. Integrações existentes (antes desta branch)

### Já implementadas

1. **Catálogo → PAIOS (Oracle Pro)**  
   - `GET /api/internal/catalog` com auth Bearer/`X-PAIOS-Catalog-Secret`  
   - Script PAIOS: `scripts/sync-site-catalog.sh`  
   - Mapping slug→SKU espelhado em ambos os repos  

2. **Stripe → PAIOS**  
   - `emitPaiosSaleCompleted` em `src/lib/paios-webhook.ts`  
   - Evento `sale.completed` no webhook Fernanda do PAIOS  

3. **Sites Cockpit (PAIOS)**  
   - Site registrado como `phoenix-imports` em `sites-registry.ts`  
   - Monitor read-only em `/api/sites/*` e dashboard `/executive/sites`  

### Sistema de agentes (PAIOS)

| Componente | Local | Porta |
|------------|-------|-------|
| API PAIOS | `central de operacoes autonomas/apps/api` | 3050 |
| Dashboard | `apps/dashboard` | 3051 |
| Fernanda (externo) | `phoenix-fast-reply-agent` | 3030 |
| Thalia (externo) | Thalía Assistente pessoal | 3040 |

### Endpoints PAIOS relevantes

- `GET /health`
- `POST /api/integrations/webhooks/fernanda` — `sale.completed`, `lead.created`, `lead.updated`
- `POST /api/inventory/sync` — source `site-catalog`
- `GET /api/sites/phoenix-imports/*` — cockpit read-only
- `GET /api/commercial/leads` — pipeline comercial

---

## 4. Fonte de estoque atual

| Camada | Fonte | Observação |
|--------|-------|------------|
| Site (exibição) | `src/data/products.ts` | 17 produtos, hardcoded |
| PAIOS Oracle | SQLite + CSV `phoenix-inventory.csv` | Sync via catalog API |
| Fernanda | fast-reply-agent (3030) | Inbox omnichannel, não é fonte de estoque |
| Produção real | Operacional manual | Site não substitui estoque Oracle |

**Produtos mapeados (slug→SKU):** 17/17 no `SLUG_TO_SKU`.

Produtos conhecidos presentes: AirPods 4, Redmi Buds 6 Pro, Apple AirTag, Amazfit Bip 5, Nintendo Switch 2, Sony ZV-E10, DJI Osmo Pocket 3, Insta360 X4, GoPro Max 360, Lexar Gold 128GB, Gabaon (cream + máscaras), Pioneer DDJ-400 (esgotado).

---

## 5. Segurança (auditoria)

| Item | Status |
|------|--------|
| Tokens no frontend | ✅ Stripe publishable only; DeepSeek/PAIOS server-only |
| `.env.local` | ⚠️ Não commitar; validar Vercel em prod |
| Catalog API auth | ✅ timing-safe compare |
| Lead API rate limit | ✅ 20 req/min/IP (memória) |
| CORS leads | Same-origin (site POST) |
| Webhook secrets | Server-side apenas |

**Não alterados nesta branch:** Meta tokens, Evolution, DeepSeek key em prod, ADMIN_TOKEN Fernanda.

---

## 6. Erros atuais / gaps

| Gap | Prioridade | Nota |
|-----|------------|------|
| `PAIOS_WEBHOOK_URL` pode faltar na Vercel | P1 | Leads não chegam ao PAIOS em prod |
| Estoque site vs Oracle pode divergir | P1 | Sync script + LaunchAgent |
| Chat Shyr não persiste lead | P2 | Integrar com `/api/leads` |
| Instagram/Facebook CTAs na PDP | P2 | Apenas WhatsApp hoje |
| E-commerce checkout completo | P2 | Stripe parcial (cartão) |

---

## 7. Testes executados

- [x] `npm run build` — OK
- [ ] `npm run typecheck` — pendente pós-implementação
- [ ] `npm run lint` — pendente
- [ ] Lead manual POST `/api/leads` — validar local
- [ ] Sync catalog PAIOS — requer PAIOS :3050 ativo

---

## 8. Referências cruzadas

- PAIOS: `docs/sites/SITE_TO_AGENT_MAPPING.md`
- PAIOS: `docs/sites/SITES_INTEGRATION_ROADMAP.md`
- PAIOS: `docs/INTEGRATIONS.md`
- Site: `docs/ANALISE-E-ARQUITETURA.md`
