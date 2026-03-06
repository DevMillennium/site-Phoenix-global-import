"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllProducts, getProductsByCategory } from "@/data/products";

export function ProdutosConteudo() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");

  const products = useMemo(() => {
    if (categoria) return getProductsByCategory(categoria);
    return getAllProducts();
  }, [categoria]);

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-phoenix-text-muted">
        Nenhum produto encontrado nesta categoria.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} index={i} />
        </li>
      ))}
    </ul>
  );
}
