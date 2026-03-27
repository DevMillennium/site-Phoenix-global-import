import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";
import { categories } from "@/data/products";
import type { SortOption } from "@/lib/product-queries";

interface ProductListingProps {
  products: Product[];
  /** Query atual de busca (para manter no form) */
  query?: string;
  /** Categoria ativa (slug) ou vazio */
  categorySlug?: string;
  sort: SortOption;
  /** Título da página (ex.: Produtos ou nome da categoria) */
  title: string;
  description: string;
}

const sortLabels: Record<SortOption, string> = {
  relevancia: "Relevância",
  "preco-asc": "Menor preço",
  "preco-desc": "Maior preço",
  nome: "Nome (A–Z)",
};

function buildQuery(params: { q?: string; ordenar?: SortOption }): string {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.ordenar && params.ordenar !== "relevancia") sp.set("ordenar", params.ordenar);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function hrefCategoria(slug: string, params: { q?: string; ordenar?: SortOption }): string {
  return `/categoria/${slug}${buildQuery(params)}`;
}

function hrefTodos(params: { q?: string; ordenar?: SortOption }): string {
  return `/produtos${buildQuery(params)}`;
}

export function ProductListing({
  products,
  query = "",
  categorySlug,
  sort,
  title,
  description,
}: ProductListingProps) {
  const formAction = categorySlug ? `/categoria/${categorySlug}` : "/produtos";
  const qParams = { q: query, ordenar: sort };

  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">{description}</p>
      </header>

      <form
        method="GET"
        action={formAction}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
        role="search"
        aria-label="Buscar e filtrar produtos"
      >
        <div className="flex-1 min-w-[min(100%,16rem)]">
          <label htmlFor="plp-q" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="plp-q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Buscar por nome ou descrição..."
            className="w-full rounded-lg border border-phoenix-border bg-phoenix-card px-4 py-3 text-sm text-phoenix-text placeholder:text-phoenix-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary min-h-touch"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div>
            <label htmlFor="plp-sort" className="block text-xs text-phoenix-text-muted mb-1">
              Ordenar
            </label>
            <select
              id="plp-sort"
              name="ordenar"
              defaultValue={sort}
              className="w-full sm:w-48 rounded-lg border border-phoenix-border bg-phoenix-card px-3 py-3 text-sm text-phoenix-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary min-h-touch"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center min-h-touch rounded-lg bg-phoenix-primary px-5 py-3 text-sm font-medium text-white hover:opacity-95 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phoenix-primary"
          >
            Aplicar
          </button>
        </div>
      </form>

      <nav aria-label="Categorias" className="mb-8 sm:mb-10">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={hrefTodos(qParams)}
              className={`inline-flex items-center min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium touch-manipulation transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary ${
                !categorySlug
                  ? "bg-phoenix-primary/20 text-phoenix-primary"
                  : "text-phoenix-text-muted hover:bg-phoenix-card hover:text-phoenix-text"
              }`}
            >
              Todos
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={hrefCategoria(cat.slug, qParams)}
                className={`inline-flex items-center min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium touch-manipulation transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary ${
                  categorySlug === cat.slug
                    ? "bg-phoenix-primary/20 text-phoenix-primary"
                    : "text-phoenix-text-muted hover:bg-phoenix-card hover:text-phoenix-text"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length === 0 ? (
        <p className="py-12 text-center text-phoenix-text-muted">
          Nenhum produto encontrado. Tente outro termo ou categoria.
        </p>
      ) : (
        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
        >
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
