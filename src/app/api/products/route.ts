import { NextResponse } from "next/server";
import { listPublicProducts } from "@/lib/catalog-api";

export const runtime = "nodejs";

/** GET /api/products — catálogo público estruturado (sem tokens). */
export async function GET() {
  const products = listPublicProducts();
  return NextResponse.json(
    {
      site: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://phoenixglobal.com.br",
      count: products.length,
      products,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    }
  );
}
