import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeConversionSections } from "@/components/home/HomeConversionSections";
import { getFeaturedProducts } from "@/data/products";
import { getBaseUrl } from "@/lib/env";
import { siteStrategy } from "@/lib/site-strategy";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Eletrônicos e tecnologia importados com estoque em Fortaleza e envio para todo o Brasil. Produtos originais, pronta entrega e suporte especializado.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const featured = getFeaturedProducts();
  const siteUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Phoenix Global Import",
    url: siteUrl,
    description: siteStrategy.propostaDeValor,
    areaServed: "BR",
    slogan: "Eletrônicos importados com pronta entrega e suporte consultivo.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero />
      <HomeFeatured featured={featured} />
      <HomeConversionSections />
    </>
  );
}
