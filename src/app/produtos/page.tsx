import { ProductListing } from "@/components/product/ProductListing";
import {
  getAllProducts,
  getProductsByCategory,
} from "@/data/products";
import {
  searchProducts,
  sortProducts,
  type SortOption,
} from "@/lib/product-queries";

export const metadata = {
  title: "Produtos",
  description:
    "Eletrônicos e tecnologia importados: câmeras, áudio, gaming, wearables e mais. Estoque em Fortaleza, envio para todo o Brasil.",
};

const sortValues: SortOption[] = ["relevancia", "preco-asc", "preco-desc", "nome"];

function parseSort(raw: string | undefined): SortOption {
  if (raw && sortValues.includes(raw as SortOption)) return raw as SortOption;
  return "relevancia";
}

type PageProps = {
  searchParams: Promise<{ categoria?: string; q?: string; ordenar?: string }>;
};

export default async function ProdutosPage({ searchParams }: PageProps) {
  const { categoria, q, ordenar } = await searchParams;
  const sort = parseSort(ordenar);

  let list = categoria ? getProductsByCategory(categoria) : getAllProducts();
  list = searchProducts(q ?? "", list);
  list = sortProducts(list, sort);

  return (
    <ProductListing
      products={list}
      query={q ?? ""}
      categorySlug={categoria}
      sort={sort}
      title="Produtos"
      description="Eletrônicos e tecnologia com pronta entrega. Enviamos para todo o Brasil."
    />
  );
}
