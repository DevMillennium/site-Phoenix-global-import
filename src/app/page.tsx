import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { getFeaturedProducts } from "@/data/products";

export const metadata = {
  title: "Início",
  description:
    "Eletrônicos e tecnologia importados. Estoque em Fortaleza, envio para todo o Brasil. AirPods, câmeras, gaming e mais.",
};

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <HomeHero />
      <HomeFeatured featured={featured} />
    </>
  );
}
