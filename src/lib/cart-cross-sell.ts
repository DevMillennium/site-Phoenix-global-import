import type { Product } from "@/types/product";
import { getAllProducts } from "@/data/products";

export function getCrossSellForCart(slugsInCart: Set<string>, limit = 4): Product[] {
  return getAllProducts()
    .filter((p) => p.inStock && !slugsInCart.has(p.slug))
    .slice(0, limit);
}
