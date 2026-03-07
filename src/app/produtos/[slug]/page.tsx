import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BotaoPagarCartao } from "@/components/checkout/BotaoPagarCartao";
import { getWhatsAppNumber, absoluteUrl } from "@/lib/env";

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  const imageUrl = product.images[0] ? absoluteUrl(product.images[0]) : undefined;
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const whatsappNumber = getWhatsAppNumber();
  const message = encodeURIComponent(
    `Olá! Gostaria de comprar: ${product.name} - ${formatPrice(product.price)}.`
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-phoenix-text-muted">
          <li>
            <Link href="/" className="hover:text-phoenix-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/produtos" className="hover:text-phoenix-primary transition-colors">
              Produtos
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-phoenix-text" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-phoenix-card border border-phoenix-border">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
          <h1 className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-phoenix-text-muted">
            {product.shortDescription}
          </p>
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
          {product.quantity != null && (
            <p className="mt-2 text-sm text-phoenix-text-muted">
              {product.quantity} {product.quantity === 1 ? "unidade" : "unidades"} em estoque
            </p>
          )}
          <p className="mt-4 text-phoenix-text">
            {product.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-phoenix-success px-6 py-3 font-medium text-white hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Comprar no WhatsApp
            </a>
            <BotaoPagarCartao
              slug={product.slug}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-phoenix-primary px-6 py-3 font-medium text-phoenix-primary hover:bg-phoenix-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary disabled:opacity-50"
            >
              Pagar com cartão
            </BotaoPagarCartao>
            <Button href="/contato#cotacao" variant="outline" size="lg">
              Solicitar cotação
            </Button>
          </div>
          {product.views != null && product.views >= 1000 && (
            <p className="mt-4 text-sm text-phoenix-text-muted" aria-label={`${product.views} visualizações`}>
              {product.views >= 1000
                ? `${(product.views / 1000).toFixed(1).replace(".", ",")} mil visualizações`
                : `${product.views} visualizações`}
            </p>
          )}
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images[0] ? absoluteUrl(product.images[0]) : undefined,
            offers: {
              "@type": "Offer",
              price: product.pricePix ?? product.price,
              priceCurrency: "BRL",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </div>
  );
}
