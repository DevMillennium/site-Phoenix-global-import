export type LeadIntent =
  | "product_interest"
  | "availability_check"
  | "buy_whatsapp"
  | "import_request"
  | "talk_to_fernanda"
  | "form_submitted"
  | "general";

export type SiteLeadInput = {
  source?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  sku?: string;
  location?: string;
  channelPreference?: "whatsapp" | "instagram" | "site";
  customerName?: string;
  customerPhone?: string;
  message?: string;
  intent?: LeadIntent;
  utm?: {
    source?: string;
    campaign?: string;
    content?: string;
  };
};

const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;

export function validateLeadInput(body: unknown): { ok: true; data: SiteLeadInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Payload inválido" };
  }

  const raw = body as Record<string, unknown>;
  const data: SiteLeadInput = {
    source: typeof raw.source === "string" ? raw.source.slice(0, 80) : "phoenix_imports_site",
    productId: typeof raw.productId === "string" ? raw.productId.slice(0, 64) : undefined,
    productSlug: typeof raw.productSlug === "string" ? raw.productSlug.slice(0, 120) : undefined,
    productName: typeof raw.productName === "string" ? raw.productName.slice(0, 200) : undefined,
    sku: typeof raw.sku === "string" ? raw.sku.slice(0, 64) : undefined,
    location: typeof raw.location === "string" ? raw.location.slice(0, 64) : undefined,
    channelPreference:
      raw.channelPreference === "whatsapp" ||
      raw.channelPreference === "instagram" ||
      raw.channelPreference === "site"
        ? raw.channelPreference
        : "whatsapp",
    customerName: typeof raw.customerName === "string" ? raw.customerName.trim().slice(0, 120) : undefined,
    customerPhone: typeof raw.customerPhone === "string" ? raw.customerPhone.trim().slice(0, 24) : undefined,
    message: typeof raw.message === "string" ? raw.message.trim().slice(0, 2000) : undefined,
    intent:
      raw.intent === "product_interest" ||
      raw.intent === "availability_check" ||
      raw.intent === "buy_whatsapp" ||
      raw.intent === "import_request" ||
      raw.intent === "talk_to_fernanda" ||
      raw.intent === "form_submitted" ||
      raw.intent === "general"
        ? raw.intent
        : "product_interest",
    utm:
      raw.utm && typeof raw.utm === "object"
        ? {
            source: typeof (raw.utm as Record<string, unknown>).source === "string"
              ? String((raw.utm as Record<string, unknown>).source).slice(0, 80)
              : undefined,
            campaign: typeof (raw.utm as Record<string, unknown>).campaign === "string"
              ? String((raw.utm as Record<string, unknown>).campaign).slice(0, 120)
              : undefined,
            content: typeof (raw.utm as Record<string, unknown>).content === "string"
              ? String((raw.utm as Record<string, unknown>).content).slice(0, 120)
              : undefined,
          }
        : undefined,
  };

  if (data.customerPhone && !PHONE_RE.test(data.customerPhone)) {
    return { ok: false, error: "Telefone inválido" };
  }

  if (!data.productName && !data.message && data.intent !== "general") {
    return { ok: false, error: "Informe produto ou mensagem" };
  }

  return { ok: true, data };
}

export function buildLeadExternalId(slug?: string): string {
  const base = slug ? slug.replace(/[^a-z0-9-]/gi, "").slice(0, 40) : "site";
  return `import-${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
