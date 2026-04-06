import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br";
  return url.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/teste-alteracoes", "/emulador-mobile"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
