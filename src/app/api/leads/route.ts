import { NextResponse } from "next/server";
import { emitPaiosLeadCreated } from "@/lib/paios-webhook";
import { buildLeadExternalId, validateLeadInput } from "@/lib/leads-schema";

export const runtime = "nodejs";

const recentByIp = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return true;
  hits.push(now);
  recentByIp.set(ip, hits);
  return false;
}

/**
 * POST /api/leads — captura lead do site e encaminha ao PAIOS (Fernanda).
 * Tokens ficam apenas server-side (PAIOS_WEBHOOK_URL + PAIOS_WEBHOOK_SECRET).
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = validateLeadInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });
  }

  const { data } = parsed;
  const externalId = buildLeadExternalId(data.productSlug);

  const payload = {
    event_type: "lead.created" as const,
    external_id: externalId,
    name: data.customerName,
    phone: data.customerPhone,
    product: data.productName,
    sku: data.sku,
    location: data.location,
    channel: "site",
    status: "new",
    utm_source: data.utm?.source,
    utm_campaign: data.utm?.campaign,
    utm_content: data.utm?.content,
    metadata: {
      source: data.source ?? "phoenix_imports_site",
      productId: data.productId,
      productSlug: data.productSlug,
      channelPreference: data.channelPreference,
      intent: data.intent,
      message: data.message,
      clientIp: ip,
      registeredAt: new Date().toISOString(),
    },
  };

  void emitPaiosLeadCreated(payload);

  return NextResponse.json({
    ok: true,
    externalId,
    forwarded: Boolean(process.env.PAIOS_WEBHOOK_URL?.trim()),
    message: "Lead registrado. Nossa equipe retorna pelo canal escolhido.",
  });
}
