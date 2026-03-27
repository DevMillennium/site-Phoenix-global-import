"use client";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface CrossSellRowProps {
  products: Product[];
  title?: string;
}

export function CrossSellRow({
  products,
  title = "Você também pode gostar",
}: CrossSellRowProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="cross-sell-heading">
      <h2 id="cross-sell-heading" className="font-display text-lg font-semibold text-phoenix-text">
        {title}
      </h2>
      <ul
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
      >
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
