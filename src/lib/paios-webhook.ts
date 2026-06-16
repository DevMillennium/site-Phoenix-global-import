/**
 * Sprint 6.x — Stripe checkout → PAIOS sale.completed
 */

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

export async function emitPaiosSaleCompleted(payload: PaiosSalePayload): Promise<void> {
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
      console.warn("[paios-sale]", res.status, text.slice(0, 200));
    }
  } catch (err) {
    console.warn("[paios-sale]", err instanceof Error ? err.message : err);
  }
}
