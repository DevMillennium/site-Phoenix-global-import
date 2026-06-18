"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BotaoPagarCartao } from "@/components/checkout/BotaoPagarCartao";
import { LinkWhatsApp } from "@/components/checkout/LinkWhatsApp";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFaq } from "@/components/product/ProductFaq";
import { getDefaultProductFaq } from "@/lib/product-queries";
import {
  buildFernandaWhatsAppMessage,
  getProductSkuMapping,
  getProductWhatsAppLink,
  type ProductCtaIntent,
} from "@/lib/product-cta";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const skuMap = getProductSkuMapping(product);
  const leadBase = {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    sku: skuMap.sku,
    location: skuMap.location,
  };

  const linkFor = (intent: ProductCtaIntent) => getProductWhatsAppLink(product, intent);
  const linkComprarWhatsApp = linkFor("buy_whatsapp");
  const linkImportacao = linkFor("import_request");
  const linkFernanda = linkFor("talk_to_fernanda");
  const linkDisponibilidade = linkFor("availability_check");
  const isOutOfStock = !product.inStock;
  const faqItems = [...(product.faq ?? []), ...getDefaultProductFaq(product)];
  const priceLabel = product.pricePix ? formatPrice(product.pricePix) : formatPrice(product.price);
  const badgesVisiveis = product.badges.filter((b) => product.inStock || b !== "pronta-entrega");

  return (
    <>
      <article className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 pb-28 lg:pb-0" id="opcoes-compra">
        <ProductGallery
          images={product.images}
          alt={product.name}
          priority
          outOfStock={isOutOfStock}
        />

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {badgesVisiveis.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
          <h1 className="font-display text-xl font-bold text-phoenix-text sm:text-2xl md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
            {product.shortDescription}
          </p>

          {isOutOfStock ? (
            <>
              <p className="mt-4 inline-flex items-center rounded-md border border-red-500/50 bg-red-600/15 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-red-300">
                Esgotado
              </p>
              <p className="mt-4 text-sm text-phoenix-text-muted">
                Valor de referência:{" "}
                <span className="text-phoenix-text line-through decoration-phoenix-muted/80">
                  {formatPrice(product.price)}
                </span>
              </p>
            </>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-phoenix-primary">
                  {product.pricePix ? formatPrice(product.pricePix) : formatPrice(product.price)}
                </span>
                {product.pricePix && (
                  <span className="text-sm text-phoenix-text-muted">
                    no PIX · ou {formatPrice(product.price)} no cartão
                  </span>
                )}
              </div>
              {product.quantity != null && product.quantity > 0 && (
                <p className="mt-2 text-sm text-phoenix-text-muted">
                  {product.quantity} {product.quantity === 1 ? "unidade" : "unidades"} em estoque
                </p>
              )}
            </>
          )}

          <p className="mt-4 text-phoenix-text">{product.description}</p>

          {isOutOfStock ? (
            <div className="mt-6 sm:mt-8 flex flex-col gap-3">
              <p className="text-sm text-phoenix-text-muted">
                Este item não está disponível para compra imediata. Solicite importação e retornamos no WhatsApp com prazo e condições.
              </p>
              <LinkWhatsApp
                href={linkImportacao}
                className="inline-flex w-full sm:w-auto items-center justify-center min-h-touch gap-2 rounded-lg bg-phoenix-success px-5 py-3 sm:px-6 font-medium text-white hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation cursor-pointer"
                ariaLabel={`Solicitar importação de ${product.name} pelo WhatsApp`}
                trackingSource="pdp"
                trackingAction="solicitar_importacao_whatsapp"
                leadContext={{ ...leadBase, intent: "import_request", message: buildFernandaWhatsAppMessage(product, "import_request") }}
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Solicitar importação
              </LinkWhatsApp>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <AddToCartButton
                slug={product.slug}
                name={product.name}
                price={product.pricePix ?? product.price}
                quantity={1}
              />
              <LinkWhatsApp
                href={linkComprarWhatsApp}
                className="inline-flex items-center justify-center min-h-touch gap-2 rounded-lg bg-phoenix-success px-5 py-3 sm:px-6 font-medium text-white hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation cursor-pointer"
                ariaLabel={`Comprar ${product.name} pelo WhatsApp`}
                trackingSource="pdp"
                trackingAction="comprar_whatsapp"
                leadContext={{ ...leadBase, intent: "buy_whatsapp", message: buildFernandaWhatsAppMessage(product, "buy_whatsapp") }}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Comprar no WhatsApp
              </LinkWhatsApp>
              <LinkWhatsApp
                href={linkDisponibilidade}
                className="inline-flex items-center justify-center min-h-touch gap-2 rounded-lg border border-phoenix-success/60 bg-phoenix-success/10 px-5 py-3 sm:px-6 font-medium text-phoenix-text hover:bg-phoenix-success/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation cursor-pointer"
                ariaLabel={`Consultar disponibilidade de ${product.name}`}
                trackingSource="pdp"
                trackingAction="consultar_disponibilidade_whatsapp"
                leadContext={{ ...leadBase, intent: "availability_check", message: buildFernandaWhatsAppMessage(product, "availability_check") }}
              >
                Consultar disponibilidade
              </LinkWhatsApp>
              <LinkWhatsApp
                href={linkFernanda}
                className="inline-flex items-center justify-center min-h-touch gap-2 rounded-lg border border-phoenix-border px-5 py-3 sm:px-6 font-medium text-phoenix-text-muted hover:text-phoenix-text hover:border-phoenix-primary/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation cursor-pointer text-sm"
                ariaLabel={`Falar com Fernanda sobre ${product.name}`}
                trackingSource="pdp"
                trackingAction="falar_com_fernanda_whatsapp"
                leadContext={{ ...leadBase, intent: "talk_to_fernanda", message: buildFernandaWhatsAppMessage(product, "talk_to_fernanda") }}
              >
                Falar com Fernanda
              </LinkWhatsApp>
              <div className="flex flex-col gap-1">
                <BotaoPagarCartao
                  slug={product.slug}
                  className="inline-flex items-center justify-center min-h-touch gap-2 rounded-lg border border-phoenix-primary px-5 py-3 sm:px-6 font-medium text-phoenix-primary hover:bg-phoenix-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary disabled:opacity-50 touch-manipulation"
                >
                  Pagar com cartão
                </BotaoPagarCartao>
                <span className="text-xs text-phoenix-text-muted">
                  Parcelamento e pagamento seguro via Stripe
                </span>
              </div>
              <Button
                href="/contato#cotacao"
                variant="outline"
                size="lg"
                trackingEvent="cta_click"
                trackingPayload={{ source: "pdp", action: "solicitar_cotacao", destination: "/contato#cotacao" }}
              >
                Solicitar cotação
              </Button>
            </div>
          )}

          {product.views != null && product.views >= 1000 && (
            <p
              className="mt-4 text-sm text-phoenix-text-muted"
              aria-label={`${product.views} visualizações`}
            >
              {product.views >= 1000
                ? `${(product.views / 1000).toFixed(1).replace(".", ",")} mil visualizações`
                : `${product.views} visualizações`}
            </p>
          )}

          <ProductFaq items={faqItems} />
        </div>
      </article>

      {/* Barra fixa mobile: compra rápida */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 bottom-0 z-[100] border-t border-phoenix-border bg-phoenix-dark/95 backdrop-blur supports-[backdrop-filter]:bg-phoenix-dark/90",
          "pb-[env(safe-area-inset-bottom)] pt-2 px-4 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]"
        )}
      >
        {isOutOfStock ? (
          <div className="container py-2">
            <LinkWhatsApp
              href={linkImportacao}
              className="flex w-full items-center justify-center min-h-touch gap-2 rounded-lg bg-phoenix-success px-4 py-3 font-medium text-white hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
              ariaLabel={`Solicitar importação de ${product.name} pelo WhatsApp`}
              trackingSource="pdp_mobile_bar"
              trackingAction="solicitar_importacao_whatsapp"
              leadContext={{ ...leadBase, intent: "import_request", message: buildFernandaWhatsAppMessage(product, "import_request") }}
            >
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitar importação
            </LinkWhatsApp>
            <p className="mt-1 text-center text-[10px] text-phoenix-muted">
              <Link href="#opcoes-compra" className="underline underline-offset-2">
                Ver detalhes do produto
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="container flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="text-xs text-phoenix-text-muted truncate">{product.name}</p>
                <p className="text-lg font-bold text-phoenix-primary">{priceLabel}</p>
              </div>
              <AddToCartButton
                slug={product.slug}
                name={product.name}
                price={product.pricePix ?? product.price}
                quantity={1}
                className="shrink-0 border-phoenix-primary bg-phoenix-primary text-white hover:bg-phoenix-primary-hover hover:border-phoenix-primary-hover"
              >
                Adicionar
              </AddToCartButton>
            </div>
            <p className="text-center text-[10px] text-phoenix-muted pb-1">
              <Link href="#opcoes-compra" className="underline underline-offset-2">
                Ver todas as opções de compra
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
