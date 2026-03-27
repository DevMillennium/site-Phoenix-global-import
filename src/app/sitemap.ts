import type { MetadataRoute } from "next";
import { categories, getAllProducts } from "@/data/products";

/** URL base do site. Calculada em runtime para evitar 500 por env em edge. */
function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br";
  return url.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const baseUrl = getBaseUrl();
    const products = getAllProducts();

    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/produtos/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    const staticPages: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/produtos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${baseUrl}/carrinho`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${baseUrl}/politicas/envio`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
      { url: `${baseUrl}/politicas/troca`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
      { url: `${baseUrl}/politicas/privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ];

    return [...staticPages, ...categoryUrls, ...productUrls];
  } catch (err) {
    console.error("[sitemap] Erro ao gerar sitemap:", err);
    const baseUrl = getBaseUrl();
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/produtos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${baseUrl}/carrinho`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];
  }
}
