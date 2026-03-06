import { MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobalimport.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const productUrls = products.map((p) => ({
    url: `${BASE_URL}/produtos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/produtos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/carrinho`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...productUrls,
  ];
}
