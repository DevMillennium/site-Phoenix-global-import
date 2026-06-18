"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { instagramPromoBanner, instagramReels } from "@/data/instagram-campaign";
import { getProductBySlug } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { getInstagramHandle, getInstagramUrl } from "@/lib/social";
import { Button } from "@/components/ui/Button";

function reelProductUrl(slug: string): string {
  return `/produtos/${slug}?utm_source=instagram&utm_medium=reel_home&utm_campaign=${slug}`;
}

export function HomeInstagramReels() {
  const reduceMotion = useReducedMotion();
  const prefersReduced = reduceMotion === true;
  const handle = getInstagramHandle();

  return (
    <section
      className="border-y border-phoenix-border bg-gradient-to-b from-phoenix-surface/60 to-phoenix-dark"
      aria-labelledby="instagram-reels-heading"
    >
      <div className="container py-12 sm:py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReduced ? 0 : 0.45 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-phoenix-primary">
              @{handle}
            </p>
            <h2
              id="instagram-reels-heading"
              className="mt-2 font-display text-2xl font-bold text-phoenix-text md:text-3xl"
            >
              {instagramPromoBanner.title}
            </h2>
            <p className="mt-3 text-phoenix-text-muted">{instagramPromoBanner.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={instagramPromoBanner.ctaHref}
                size="lg"
                trackingEvent="cta_click"
                trackingPayload={{
                  source: "home_instagram_reels",
                  action: "ver_ofertas_instagram",
                  destination: "/produtos",
                }}
              >
                Ver ofertas do Instagram
              </Button>
              <Button
                href={getInstagramUrl()}
                variant="outline"
                size="lg"
                trackingEvent="cta_click"
                trackingPayload={{
                  source: "home_instagram_reels",
                  action: "seguir_instagram",
                  destination: getInstagramUrl(),
                }}
              >
                Seguir no Instagram
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReduced ? 0 : 0.45, delay: 0.1 }}
            className="relative mx-auto aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-2xl border border-phoenix-border shadow-2xl"
          >
            <Image
              src={instagramPromoBanner.poster}
              alt="Campanha promocional Phoenix Imports no Instagram"
              fill
              sizes="220px"
              className="object-cover"
              unoptimized={process.env.NODE_ENV === "development"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-phoenix-dark/90 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-phoenix-text">
              Reels com preço PIX e estoque real
            </p>
          </motion.div>
        </div>

        <ul
          className="mt-10 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin"
          role="list"
          aria-label="Reels do Instagram com link para produtos"
        >
          {instagramReels.map((reel, i) => {
            const product = getProductBySlug(reel.productSlug);
            const displayPrice = product?.pricePix ?? product?.price;
            const hasPromo = product?.pricePix != null && product.pricePix < product.price;

            return (
              <li key={reel.id} className="snap-start shrink-0 w-[168px] sm:w-[188px]">
                <motion.article
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: prefersReduced ? 0 : 0.35, delay: i * 0.05 }}
                  className="group"
                >
                  <Link
                    href={reelProductUrl(reel.productSlug)}
                    className="block overflow-hidden rounded-xl border border-phoenix-border bg-phoenix-card hover:border-phoenix-primary/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
                    aria-label={`${reel.hook} — ver ${product?.name ?? "produto"}`}
                  >
                    <div className="relative aspect-[9/16] bg-phoenix-surface">
                      <Image
                        src={reel.poster}
                        alt={reel.hook}
                        fill
                        sizes="188px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        unoptimized={process.env.NODE_ENV === "development"}
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {reel.promoTag}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-phoenix-primary/90 text-white">
                          <svg className="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-phoenix-text line-clamp-2">{reel.hook}</p>
                      {product && displayPrice != null && (
                        <p className="mt-1.5 text-sm font-semibold text-phoenix-primary">
                          {formatPrice(displayPrice)}
                          {hasPromo && (
                            <span className="ml-1.5 text-xs font-normal text-phoenix-muted line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          {product.pricePix && (
                            <span className="block text-[10px] font-normal text-emerald-400/90">no PIX</span>
                          )}
                        </p>
                      )}
                      {!product?.inStock && (
                        <p className="mt-1 text-[10px] text-red-300">Consultar disponibilidade</p>
                      )}
                    </div>
                  </Link>
                  <a
                    href={reel.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 block text-center text-[10px] text-phoenix-text-muted hover:text-phoenix-primary transition-colors"
                  >
                    Ver Reel original ↗
                  </a>
                </motion.article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
