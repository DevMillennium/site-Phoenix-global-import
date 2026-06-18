import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HomeInstagramReels } from "@/components/home/HomeInstagramReels";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeConversionSections } from "@/components/home/HomeConversionSections";
import { getFeaturedProducts } from "@/data/products";
import { getBaseUrl } from "@/lib/env";
import { getSocialSameAs } from "@/lib/social";
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Phoenix Global Import",
    url: siteUrl,
    description: siteStrategy.propostaDeValor,
    areaServed: "BR",
    slogan: "Eletrônicos importados com pronta entrega e suporte consultivo.",
    sameAs: getSocialSameAs(),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Phoenix Global Import",
    url: siteUrl,
    description:
      "Eletrônicos e tecnologia importados com estoque em Fortaleza e envio para todo o Brasil.",
    publisher: { "@type": "Organization", name: "Phoenix Global Import", url: siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/produtos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <HomeHero />
      <TrustStrip />
      <HomeInstagramReels />
      <HomeFeatured featured={featured} />
      <HomeConversionSections />
    </>
  );
}
