/**
 * Sprint 6.x — Stripe checkout → PAIOS sale.completed
 * Integração site ↔ PAIOS (Central de Operações Autônomas)
 */

export interface PaiosLeadPayload {
  event_type: "lead.created";
  external_id: string;
  name?: string;
  phone?: string;
  product?: string;
  sku?: string;
  location?: string;
  channel?: string;
  status?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  metadata?: Record<string, unknown>;
}

export interface PaiosSalePayload {
  event_type: "sale.completed";
  external_id: string;
  sku: string;
  location: string;
  quantity: number;
  revenue: number;
  product_name: string;
  sold_at: string;
  channel: string;
  metadata?: Record<string, unknown>;
}

import { SLUG_TO_SKU } from "@/lib/paios-catalog-mapping";

export { SLUG_TO_SKU };

function paiosWebhookUrl(): string | null {
  const base = process.env.PAIOS_WEBHOOK_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "") + "/api/integrations/webhooks/fernanda";
}

async function postPaiosWebhook(payload: PaiosSalePayload | PaiosLeadPayload, logTag: string): Promise<void> {
  const url = paiosWebhookUrl();
  if (!url) return;

  const secret = process.env.PAIOS_WEBHOOK_SECRET?.trim();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["X-PAIOS-Webhook-Secret"] = secret;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[${logTag}]`, res.status, text.slice(0, 200));
    }
  } catch (err) {
    console.warn(`[${logTag}]`, err instanceof Error ? err.message : err);
  }
}

export async function emitPaiosSaleCompleted(payload: PaiosSalePayload): Promise<void> {
  await postPaiosWebhook(payload, "paios-sale");
}

/** Registra lead no PAIOS (Fernanda / Commercial Intelligence). Fire-and-forget. */
export async function emitPaiosLeadCreated(payload: PaiosLeadPayload): Promise<void> {
  await postPaiosWebhook(
    {
      ...payload,
      event_type: "lead.created",
      channel: payload.channel ?? "site",
      status: payload.status ?? "new",
    },
    "paios-lead"
  );
}
