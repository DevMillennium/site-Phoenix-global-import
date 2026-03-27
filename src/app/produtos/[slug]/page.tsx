import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/data/products";
import { absoluteUrl } from "@/lib/env";
import { PaymentStatusBanner } from "@/components/checkout/PaymentStatusBanner";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getRelatedProducts } from "@/lib/product-queries";
import { SITE_BRAND_NAME } from "@/lib/constants";

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
  const canonical = absoluteUrl(`/produtos/${slug}`);
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: imageUrl ? [imageUrl] : [],
      url: canonical,
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

  const related = getRelatedProducts(slug, 4);
  const productUrl = absoluteUrl(`/produtos/${slug}`);
  const imageUrl = product.images[0] ? absoluteUrl(product.images[0]) : undefined;
  const offerPrice = product.pricePix ?? product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: SITE_BRAND_NAME,
    },
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: offerPrice,
      priceCurrency: "BRL",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_BRAND_NAME,
      },
    },
  };

  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <Suspense fallback={null}>
        <PaymentStatusBanner />
      </Suspense>

      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-phoenix-text-muted">
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
          <li>
            <Link
              href={`/categoria/${product.categorySlug}`}
              className="hover:text-phoenix-primary transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-phoenix-text" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetailClient product={product} />

      <RelatedProducts products={related} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </div>
  );
}
