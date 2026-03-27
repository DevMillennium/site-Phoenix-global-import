import { notFound } from "next/navigation";
import { ProductListing } from "@/components/product/ProductListing";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/data/products";
import {
  searchProducts,
  sortProducts,
  type SortOption,
} from "@/lib/product-queries";

const sortValues: SortOption[] = ["relevancia", "preco-asc", "preco-desc", "nome"];

function parseSort(raw: string | undefined): SortOption {
  if (raw && sortValues.includes(raw as SortOption)) return raw as SortOption;
  return "relevancia";
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; ordenar?: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Categoria" };
  return {
    title: cat.name,
    description: `Compre ${cat.name} na Phoenix Global Import. Estoque em Fortaleza, envio para todo o Brasil.`,
  };
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const { q, ordenar } = await searchParams;
  const sort = parseSort(ordenar);

  let list = getProductsByCategory(slug);
  list = searchProducts(q ?? "", list);
  list = sortProducts(list, sort);

  return (
    <ProductListing
      products={list}
      query={q ?? ""}
      categorySlug={slug}
      sort={sort}
      title={cat.name}
      description={`Produtos em ${cat.name}. Pronta entrega em Fortaleza; envio para todo o Brasil.`}
    />
  );
}
