import { NextResponse } from "next/server";
import { getPublicProductBySlug } from "@/lib/catalog-api";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

/** GET /api/products/:slug — detalhe público de um produto. */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const product = getPublicProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(product, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
