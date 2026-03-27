import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-16 border-t border-phoenix-border pt-10" aria-labelledby="relacionados">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="relacionados" className="font-display text-xl font-bold text-phoenix-text sm:text-2xl">
          Relacionados
        </h2>
        <Link
          href="/produtos"
          className="text-sm font-medium text-phoenix-primary hover:text-phoenix-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary rounded"
        >
          Ver catálogo →
        </Link>
      </div>
      <ul
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
