/**
 * Campanha Instagram @globalholdingphoenix — reels → produtos do site.
 * Preços alinhados às legendas dos Reels (jun/2026).
 */

export type InstagramReelCard = {
  id: string;
  reelUrl: string;
  poster: string;
  productSlug: string;
  hook: string;
  promoTag?: string;
  /** Preço divulgado no Reel (referência visual na home). */
  instagramPrice?: number;
};

export const instagramReels: InstagramReelCard[] = [
  {
    id: "reel-sony-zve10",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZu3XuZP-0y/",
    poster: "/instagram/sony-zv-e10-reel.png",
    productSlug: "sony-zv-e10",
    hook: "Última unidade · R$ 4.999",
    promoTag: "Urgência",
    instagramPrice: 4999,
  },
  {
    id: "reel-airpods-4",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZu1JVuvUqD/",
    poster: "/produtos/airpods-4.png",
    productSlug: "airpods-4",
    hook: "AirPods 4 ANC · 4 unidades",
    promoTag: "Destaque",
    instagramPrice: 1899,
  },
  {
    id: "reel-nintendo-switch-2",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZuz8yPvh8j/",
    poster: "/produtos/nintendo-switch-2.png",
    productSlug: "nintendo-switch-2",
    hook: "Switch 2 · última unidade",
    promoTag: "Gaming",
    instagramPrice: 3999,
  },
  {
    id: "reel-gabaon",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZuxVh7PcWO/",
    poster: "/instagram/gabaon-luxury.png",
    productSlug: "gabaon-premium-cream",
    hook: "Gabaon Premium · R$ 499",
    promoTag: "Cosméticos",
    instagramPrice: 499,
  },
  {
    id: "reel-dji-op3",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZtmyp6vbsQ/",
    poster: "/produtos/dji-osmo-pocket-3.png",
    productSlug: "dji-osmo-pocket-3",
    hook: "DJI Osmo Pocket 3 · última unidade",
    promoTag: "Câmeras",
    instagramPrice: 4299,
  },
  {
    id: "reel-insta360-x4",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZtlGnxvDzh/",
    poster: "/produtos/insta360-x4.png",
    productSlug: "insta360-x4",
    hook: "Insta360 X4 Adventure · R$ 4.299",
    promoTag: "360°",
    instagramPrice: 4299,
  },
  {
    id: "reel-gopro-max",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reel/DZtiX4KPO9l/",
    poster: "/instagram/gopro-max-reel.png",
    productSlug: "gopro-max-360",
    hook: "GoPro Max 2 8K · última unidade",
    promoTag: "Ação",
    instagramPrice: 4299,
  },
  {
    id: "reel-unboxing",
    reelUrl: "https://www.instagram.com/globalholdingphoenix/reels/",
    poster: "/instagram/unboxing-phoenix.png",
    productSlug: "airpods-4",
    hook: "Unboxing Phoenix · pronta entrega",
    promoTag: "Marca",
    instagramPrice: 1899,
  },
];

export const instagramPromoBanner = {
  poster: "/instagram/promo-now-super.png",
  title: "Ofertas que você viu no Instagram",
  subtitle: "Mesmos preços e estoque dos Reels @globalholdingphoenix — Fortaleza, pronta entrega.",
  ctaHref: "/produtos?utm_source=instagram&utm_medium=home_banner&utm_campaign=now_super",
};
