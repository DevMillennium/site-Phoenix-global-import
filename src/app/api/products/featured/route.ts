import { NextResponse } from "next/server";
import { listFeaturedPublicProducts } from "@/lib/catalog-api";

export const runtime = "nodejs";

/** GET /api/products/featured — produtos em destaque. */
export async function GET() {
  const products = listFeaturedPublicProducts();
  return NextResponse.json(
    { count: products.length, products, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
