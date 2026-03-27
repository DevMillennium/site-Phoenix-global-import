/** Corpo aceito: fluxo legado (um produto) ou carrinho (vários itens). Validação nativa (sem deps extras). */

export interface CheckoutItemInput {
  slug: string;
  quantity?: number;
}

export type CheckoutBodyParsed =
  | { mode: "single"; slug: string; quantity: number }
  | { mode: "cart"; items: { slug: string; quantity: number }[] };

function clampQty(n: unknown): number {
  const q = typeof n === "number" && !Number.isNaN(n) ? Math.floor(n) : 1;
  return Math.max(1, Math.min(99, q));
}

function isNonEmptyString(v: unknown, max = 200): v is string {
  return typeof v === "string" && v.length >= 1 && v.length <= max;
}

/**
 * Valida JSON do checkout. Retorna `{ ok: true, data }` ou `{ ok: false, error }`.
 */
export function parseCheckoutBody(raw: unknown):
  | { ok: true; data: CheckoutBodyParsed }
  | { ok: false; error: string } {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Corpo da requisição inválido." };
  }

  const o = raw as Record<string, unknown>;
  const slugRaw = o.slug;
  const quantityRaw = o.quantity;
  const itemsRaw = o.items;

  const hasSlug = isNonEmptyString(slugRaw);
  const itemsIsArray = Array.isArray(itemsRaw);
  const items = itemsIsArray ? itemsRaw : [];

  if (itemsIsArray && items.length > 0 && hasSlug) {
    return { ok: false, error: "Envie apenas items ou apenas slug, não os dois." };
  }

  if (itemsIsArray && items.length > 0) {
    if (items.length > 50) {
      return { ok: false, error: "Limite de 50 itens por pedido." };
    }
    const parsedItems: { slug: string; quantity: number }[] = [];
    for (const row of items) {
      if (row === null || typeof row !== "object" || Array.isArray(row)) {
        return { ok: false, error: "Item do carrinho inválido." };
      }
      const r = row as Record<string, unknown>;
      if (!isNonEmptyString(r.slug)) {
        return { ok: false, error: "Cada item deve ter um slug válido." };
      }
      parsedItems.push({ slug: r.slug, quantity: clampQty(r.quantity) });
    }
    return { ok: true, data: { mode: "cart", items: parsedItems } };
  }

  if (hasSlug) {
    return {
      ok: true,
      data: {
        mode: "single",
        slug: slugRaw,
        quantity: clampQty(quantityRaw),
      },
    };
  }

  return { ok: false, error: "Informe slug (um produto) ou items (carrinho)." };
}
