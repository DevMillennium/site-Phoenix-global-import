"use client";

import type { LeadIntent } from "@/lib/leads-schema";

export type RegisterLeadContext = {
  productId?: string;
  productSlug?: string;
  productName?: string;
  sku?: string;
  location?: string;
  intent?: LeadIntent;
  message?: string;
  customerName?: string;
  customerPhone?: string;
  channelPreference?: "whatsapp" | "instagram" | "site";
};

/** Fire-and-forget — não bloqueia abertura do WhatsApp. */
export function registerSiteLead(context: RegisterLeadContext): void {
  if (typeof window === "undefined") return;

  const utm = new URLSearchParams(window.location.search);
  const payload = {
    source: "phoenix_imports_site",
    ...context,
    utm: {
      source: utm.get("utm_source") ?? undefined,
      campaign: utm.get("utm_campaign") ?? undefined,
      content: utm.get("utm_content") ?? undefined,
    },
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/leads", blob);
    return;
  }

  void fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
