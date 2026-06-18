import type { Product } from "@/types/product";
import { getAllProducts, getFeaturedProducts, getProductBySlug } from "@/data/products";
import { SLUG_TO_SKU } from "@/lib/paios-catalog-mapping";

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  pricePix?: number;
  category: string;
  categorySlug: string;
  inStock: boolean;
  featured?: boolean;
  quantity?: number;
  images: string[];
  badges: string[];
  sku?: string;
  location?: string;
  availability: "in_stock" | "last_units" | "sold_out";
};

function mapAvailability(p: Product): PublicProduct["availability"] {
  if (!p.inStock) return "sold_out";
  if (p.quantity != null && p.quantity <= 2) return "last_units";
  return "in_stock";
}

export function toPublicProduct(p: Product): PublicProduct {
  const mapped = SLUG_TO_SKU[p.slug];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    pricePix: p.pricePix,
    category: p.category,
    categorySlug: p.categorySlug,
    inStock: p.inStock,
    featured: p.featured,
    quantity: p.quantity,
    images: p.images,
    badges: p.badges,
    sku: mapped?.sku,
    location: mapped?.location,
    availability: mapAvailability(p),
  };
}

export function listPublicProducts(): PublicProduct[] {
  return getAllProducts().map(toPublicProduct);
}

export function getPublicProductBySlug(slug: string): PublicProduct | undefined {
  const p = getProductBySlug(slug);
  return p ? toPublicProduct(p) : undefined;
}

export function listFeaturedPublicProducts(): PublicProduct[] {
  return getFeaturedProducts().map(toPublicProduct);
}
