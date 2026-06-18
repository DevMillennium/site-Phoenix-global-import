import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/env";
import { SLUG_TO_SKU } from "@/lib/paios-catalog-mapping";

export type ProductCtaIntent =
  | "product_interest"
  | "availability_check"
  | "buy_whatsapp"
  | "import_request"
  | "talk_to_fernanda";

const HIGH_TICKET_BRL = 2500;

function isHighTicket(product: Product): boolean {
  const value = product.pricePix ?? product.price;
  return value >= HIGH_TICKET_BRL;
}

/** Mensagem comercial alinhada à Fernanda — disponibilidade e retirada Fortaleza. */
export function buildFernandaWhatsAppMessage(
  product: Product,
  intent: ProductCtaIntent = "product_interest"
): string {
  const priceLabel = product.pricePix
    ? `${formatPrice(product.pricePix)} no PIX (ou ${formatPrice(product.price)} no cartão)`
    : formatPrice(product.price);

  if (!product.inStock || intent === "import_request") {
    return `Olá, Fernanda. Tenho interesse no ${product.name}, que vi no site da Phoenix Global Import. Ainda é possível importar? Qual prazo e valor estimado?`;
  }

  if (intent === "availability_check") {
    return `Olá, Fernanda. Vi o ${product.name} no site. Ainda está disponível? Qual o valor no Pix e como funciona a retirada/entrega em Fortaleza?`;
  }

  if (intent === "talk_to_fernanda" || isHighTicket(product)) {
    return `Olá, Fernanda. Tenho interesse no ${product.name}. Gostaria de confirmar disponibilidade, forma de pagamento e retirada em Fortaleza. Valor de referência: ${priceLabel}.`;
  }

  if (intent === "buy_whatsapp") {
    return `Olá, Fernanda! Quero comprar o ${product.name} (${priceLabel}). Ainda está disponível? Como funciona retirada em Fortaleza ou envio?`;
  }

  return `Olá, Fernanda. Tenho interesse no produto ${product.name}. Ainda está disponível? Qual o valor no Pix e como funciona a retirada/entrega?`;
}

export function getProductWhatsAppLink(
  product: Product,
  intent: ProductCtaIntent = "product_interest"
): string {
  return getWhatsAppLink(buildFernandaWhatsAppMessage(product, intent));
}

export function getProductSkuMapping(product: Product): { sku?: string; location?: string } {
  const mapped = SLUG_TO_SKU[product.slug];
  if (!mapped) return {};
  return { sku: mapped.sku, location: mapped.location };
}
