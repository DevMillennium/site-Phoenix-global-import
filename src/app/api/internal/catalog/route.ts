import { NextResponse } from "next/server";
import { buildCatalogExport } from "@/lib/catalog-export";
import { isPaiosInternalAuthorized } from "@/lib/paios-internal-auth";

export const runtime = "nodejs";

/**
 * GET /api/internal/catalog — export seguro do catálogo para sync Oracle (PAIOS).
 * Auth: Bearer token ou X-PAIOS-Catalog-Secret (= PAIOS_CATALOG_SYNC_SECRET ou PAIOS_WEBHOOK_SECRET).
 */
export async function GET(request: Request) {
  if (!isPaiosInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const catalog = buildCatalogExport();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
