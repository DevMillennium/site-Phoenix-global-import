/**
 * Campanha Instagram @globalholdingphoenix — reels → produtos do site.
 * Posters extraídos dos Reels; links apontam para PDP (conversão) com UTM.
 */

export type InstagramReelCard = {
  id: string;
  reelUrl: string;
  poster: string;
  productSlug: string;
  hook: string;
  promoTag?: string;
};

export const instagramReels: InstagramReelCard[] = [
  {
    id: "reel-sony-zve10",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZu3XuZP-0y/",
    poster: "/instagram/sony-zv-e10-reel.png",
    productSlug: "sony-zv-e10",
    hook: "Última unidade em Fortaleza",
    promoTag: "Urgência",
  },
  {
    id: "reel-airpods-4",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZu1JVuvUqD/",
    poster: "/produtos/airpods-4.png",
    productSlug: "airpods-4",
    hook: "AirPods 4 com ANC ativo",
    promoTag: "Destaque",
  },
  {
    id: "reel-gopro-max",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZuz8yPvh8j/",
    poster: "/instagram/gopro-max-reel.png",
    productSlug: "gopro-max-360",
    hook: "360° 8K · controle por voz",
    promoTag: "Ação",
  },
  {
    id: "reel-nintendo-switch-2",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZuxVh7PcWO/",
    poster: "/produtos/nintendo-switch-2.png",
    productSlug: "nintendo-switch-2",
    hook: "Switch 2 lacrado · original",
    promoTag: "Gaming",
  },
  {
    id: "reel-gabaon",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZtmyp6vbsQ/",
    poster: "/instagram/gabaon-luxury.png",
    productSlug: "gabaon-premium-cream",
    hook: "Skincare premium importado",
    promoTag: "Cosméticos",
  },
  {
    id: "reel-unboxing",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reels/",
    poster: "/instagram/unboxing-phoenix.png",
    productSlug: "airpods-4",
    hook: "Unboxing Phoenix · pronta entrega",
    promoTag: "Marca",
  },
];

export const instagramPromoBanner = {
  poster: "/instagram/promo-now-super.png",
  title: "Ofertas que você viu no Instagram",
  subtitle: "Mesmos produtos dos Reels, com preço PIX promocional e estoque em Fortaleza.",
  ctaHref: "/produtos?utm_source=instagram&utm_medium=home_banner&utm_campaign=now_super",
};
