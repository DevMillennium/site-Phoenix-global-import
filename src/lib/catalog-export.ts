import { products } from "@/data/products";
import { SLUG_TO_SKU, type CatalogExportProduct } from "@/lib/paios-catalog-mapping";

export function buildCatalogExport(): {
  site: string;
  exportedAt: string;
  products: CatalogExportProduct[];
  mappedCount: number;
  unmappedSlugs: string[];
} {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://phoenixglobal.com.br";
  const exported: CatalogExportProduct[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    quantity: p.quantity,
    price: p.price,
    pricePix: p.pricePix,
    inStock: p.inStock,
  }));

  const unmappedSlugs = exported.filter((p) => !SLUG_TO_SKU[p.slug]).map((p) => p.slug);

  return {
    site,
    exportedAt: new Date().toISOString(),
    products: exported,
    mappedCount: exported.length - unmappedSlugs.length,
    unmappedSlugs,
  };
}
