import { categories, getAllProducts } from "@/data/products";
import { getBaseUrl } from "@/lib/env";
import type { Product } from "@/types/product";

function formatMoney(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function linhaProduto(p: Product, siteBase: string): string {
  const url = `${siteBase}/produtos/${p.slug}`;
  const preco = p.pricePix != null ? `${formatMoney(p.price)} (PIX: ${formatMoney(p.pricePix)})` : formatMoney(p.price);
  const estoque = p.inStock ? (p.quantity != null ? `sim (${p.quantity} un.)` : "sim") : "não (indisponível no momento)";
  const specs =
    p.specs && Object.keys(p.specs).length > 0
      ? `\n  Especificações: ${Object.entries(p.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")}`
      : "";
  const faqExtra =
    p.faq && p.faq.length > 0
      ? `\n  Dúvidas frequentes do produto: ${p.faq.map((f) => `"${f.question}" → ${f.answer}`).join(" | ")}`
      : "";
  return (
    `- **${p.name}** (slug: ${p.slug})\n` +
    `  Categoria: ${p.category} | Condição: ${p.condition} | Preço de referência no site: ${preco}\n` +
    `  Disponibilidade (estoque): ${estoque} | Badges: ${p.badges.join(", ")}\n` +
    `  Resumo: ${p.shortDescription}\n` +
    `  Descrição: ${p.description}${specs}${faqExtra}\n` +
    `  Link: ${url}`
  );
}

/** Texto injetado no system prompt da Shyr com dados reais do catálogo. */
export function buildCatalogoContextoParaAtendente(): string {
  const siteBase = getBaseUrl().replace(/\/$/, "");
  const prods = getAllProducts();
  const cats = categories.map((c) => `- ${c.name} (${c.count} itens no site, slug /categoria/${c.slug})`).join("\n");

  const blocos = prods.map((p) => linhaProduto(p, siteBase)).join("\n\n");

  return [
    `Categorias no site:\n${cats}`,
    "",
    "Produtos (use estes dados para dúvidas comerciais e técnicas; preços e estoque são os do cadastro abaixo — se o cliente relatar divergência, oriente a atualizar a página ou falar no WhatsApp):",
    "",
    blocos,
  ].join("\n");
}
