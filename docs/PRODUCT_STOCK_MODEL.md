# Modelo de Produto e Estoque — Phoenix Global Imports

> Alinhamento site ↔ PAIOS Oracle Pro ↔ Fernanda

---

## Tipo canônico (evolução do `Product` atual)

```typescript
type PhoenixProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  categorySlug: string;
  description?: string;
  shortDescription?: string;
  priceBRL?: number;        // = price no site
  pricePYG?: number;        // futuro Paraguai
  priceUSD?: number;        // futuro export
  pixPrice?: number;        // = pricePix no site
  cardPrice?: number;       // = price no site
  stockQuantity: number;    // = quantity
  location: "fortaleza" | "paraguay" | "foz" | "other";
  availability: "in_stock" | "last_units" | "pre_order" | "sold_out";
  images: string[];
  featured: boolean;
  campaignActive: boolean;  // futuro
  tags: string[];           // futuro (= badges parcial)
  whatsappMessage?: string; // gerado por product-cta.ts
  instagramMessage?: string; // P2
  updatedAt: string;
  sku?: string;             // Oracle Pro via SLUG_TO_SKU
};
```

---

## Mapeamento site atual → canônico

| Campo site (`Product`) | Campo canônico | API pública |
|------------------------|----------------|-------------|
| `id` | `id` | ✅ |
| `slug` | `slug` | ✅ |
| `name` | `name` | ✅ |
| `price` | `cardPrice` / `priceBRL` | ✅ |
| `pricePix` | `pixPrice` | ✅ |
| `quantity` | `stockQuantity` | ✅ |
| `inStock` | `availability` | ✅ derivado |
| `featured` | `featured` | ✅ |
| `badges` | `tags` (parcial) | ✅ |
| `SLUG_TO_SKU` | `sku` + `location` | ✅ |

### Regra de `availability`

```typescript
if (!inStock) return "sold_out";
if (quantity != null && quantity <= 2) return "last_units";
return "in_stock";
```

---

## Fontes de verdade por camada

| Camada | Autoridade | Sync |
|--------|------------|------|
| **Site** | Apresentação + preço anunciado | Export via `/api/internal/catalog` |
| **PAIOS Oracle** | Estoque operacional, ABC, liquidação | `POST /api/inventory/sync` |
| **Fernanda** | Conversas, follow-up | Leads via webhook |
| **Stripe** | Pagamento confirmado | `sale.completed` |

⚠️ **Nunca** o sync site→Oracle substitui estoque real sem validação humana (ADR PAIOS).

---

## Slug → SKU (17 produtos)

Definido em:

- Site: `src/lib/paios-catalog-mapping.ts`
- PAIOS: `apps/api/src/data/site-catalog-mapping.ts`

Manter **sincronizados manualmente** ao adicionar produto.

---

## Lead context (site → PAIOS)

```json
{
  "event_type": "lead.created",
  "external_id": "import-sony-zv-e10-...",
  "product": "Sony ZV-E10",
  "sku": "SONY-ZVE10",
  "location": "Fortaleza",
  "channel": "site",
  "metadata": {
    "source": "phoenix_imports_site",
    "productSlug": "sony-zv-e10",
    "intent": "availability_check",
    "message": "Olá, Fernanda..."
  }
}
```

---

## Produtos por localização

| Local | Produtos |
|-------|----------|
| Fortaleza | Maioria (eletrônicos, Gabaon cream) |
| Foz | Gabaon máscaras (colágeno, HA) |

---

## Sincronização recomendada

```bash
# No PAIOS (a cada 6–24h ou pós-deploy site)
npm run sync:catalog
```

Logs: `data/logs/catalog-sync.log`
