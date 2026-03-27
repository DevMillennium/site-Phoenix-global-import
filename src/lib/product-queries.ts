import type { Product } from "@/types/product";
import { getAllProducts, getProductsByCategory, getProductBySlug } from "@/data/products";

export type SortOption = "relevancia" | "preco-asc" | "preco-desc" | "nome";

function effectivePrice(p: Product): number {
  return p.pricePix ?? p.price;
}

export function searchProducts(query: string, list: Product[] = getAllProducts()): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    const hay = `${p.name} ${p.shortDescription} ${p.description} ${p.category}`.toLowerCase();
    return hay.includes(q);
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "preco-asc":
      return copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "preco-desc":
      return copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "nome":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "relevancia":
    default:
      return copy.sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fb !== fa) return fb - fa;
        return (b.views ?? 0) - (a.views ?? 0);
      });
  }
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  const same = getProductsByCategory(current.categorySlug).filter((p) => p.slug !== slug);
  if (same.length >= limit) return same.slice(0, limit);
  const rest = getAllProducts().filter(
    (p) => p.slug !== slug && !same.some((s) => s.slug === p.slug)
  );
  return [...same, ...rest].slice(0, limit);
}

export function getDefaultProductFaq(product: Product): { question: string; answer: string }[] {
  const base: { question: string; answer: string }[] = [
    {
      question: "O produto é original?",
      answer:
        product.badges.includes("original")
          ? "Sim — este item está anunciado como original. Em caso de dúvida, fale conosco pelo WhatsApp antes da compra."
          : "Consulte a descrição e as fotos. Para garantias de originalidade, envie mensagem pelo WhatsApp.",
    },
    {
      question: "Como funciona o envio?",
      answer:
        "Estoque em Fortaleza (CE). Enviamos para todo o Brasil; prazo e custo de frete são combinados após o pedido (WhatsApp ou checkout).",
    },
    {
      question: "Posso trocar ou devolver?",
      answer:
        "Política de troca conforme o tipo de produto e condição. Veja a página Política de troca e fale conosco para casos específicos.",
    },
  ];
  return base;
}
