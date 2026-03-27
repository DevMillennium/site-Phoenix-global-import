export type ProductCondition = "novo" | "seminovo" | "recondicionado";

export type ProductBadge =
  | "pronta-entrega"
  | "original"
  | "seminova"
  | "promocao"
  | "destaque";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  pricePix?: number;
  category: string;
  categorySlug: string;
  condition: ProductCondition;
  badges: ProductBadge[];
  images: string[];
  videoUrl?: string;
  specs?: Record<string, string>;
  /** Perguntas específicas do produto (opcional); caso vazio, usa FAQ padrão na PDP. */
  faq?: { question: string; answer: string }[];
  views?: number;
  inStock: boolean;
  featured?: boolean;
  quantity?: number;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  description?: string;
}
