import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllProducts, getProductsByCategory, categories } from "@/data/products";

export const metadata = {
  title: "Produtos",
  description:
    "Eletrônicos e tecnologia importados: câmeras, áudio, gaming, wearables e mais. Estoque em Fortaleza, envio para todo o Brasil.",
};

type PageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProdutosPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;
  const products = categoria ? getProductsByCategory(categoria) : getAllProducts();

  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl md:text-4xl">
          Produtos
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
          Eletrônicos e tecnologia com pronta entrega. Enviamos para todo o Brasil.
        </p>
      </header>

      <nav aria-label="Categorias" className="mb-8 sm:mb-10">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/produtos"
              className={`inline-flex items-center min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium touch-manipulation transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary ${
                !categoria
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
                href={`/produtos?categoria=${cat.slug}`}
                className={`inline-flex items-center min-h-touch rounded-lg px-4 py-2.5 text-sm font-medium touch-manipulation transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary ${
                  categoria === cat.slug
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
          Nenhum produto encontrado nesta categoria.
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
