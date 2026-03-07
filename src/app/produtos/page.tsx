import { Suspense } from "react";
import Link from "next/link";
import { ProdutosConteudo } from "./ProdutosConteudo";
import { categories } from "@/data/products";

export const metadata = {
  title: "Produtos",
  description:
    "Eletrônicos e tecnologia importados: câmeras, áudio, gaming, wearables e mais. Estoque em Fortaleza, envio para todo o Brasil.",
};

export default function ProdutosPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-phoenix-text md:text-4xl">
          Produtos
        </h1>
        <p className="mt-2 text-phoenix-text-muted">
          Eletrônicos e tecnologia com pronta entrega. Enviamos para todo o Brasil.
        </p>
      </header>

      <nav aria-label="Categorias" className="mb-10">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/produtos"
              className="rounded-lg bg-phoenix-primary/20 px-4 py-2 text-sm font-medium text-phoenix-primary"
            >
              Todos
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/produtos?categoria=${cat.slug}`}
                className="rounded-lg px-4 py-2 text-sm font-medium text-phoenix-text-muted hover:bg-phoenix-card hover:text-phoenix-text transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<GridSkeleton />}>
        <ProdutosConteudo />
      </Suspense>
    </div>
  );
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="rounded-xl bg-phoenix-card border border-phoenix-border overflow-hidden">
          <div className="aspect-square bg-phoenix-surface animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-phoenix-surface rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-phoenix-surface rounded w-1/2 animate-pulse" />
            <div className="h-5 bg-phoenix-surface rounded w-1/3 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}
