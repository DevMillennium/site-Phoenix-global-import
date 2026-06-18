"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { instagramReels } from "@/data/instagram-campaign";

interface ProductReelStripProps {
  product: Product;
}

/** Exibe o Reel do Instagram ligado ao produto (se existir na campanha). */
export function ProductReelStrip({ product }: ProductReelStripProps) {
  if (!product.videoUrl) return null;

  const campaignReel = instagramReels.find((r) => r.productSlug === product.slug);
  const poster = campaignReel?.poster ?? product.images[0];
  const hook = campaignReel?.hook ?? "Assista ao vídeo que postamos no Instagram.";

  return (
    <section
      className="mt-8 rounded-xl border border-phoenix-border bg-phoenix-card/50 p-4 sm:p-5"
      aria-label="Vídeo do Instagram sobre este produto"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          href={product.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mx-auto sm:mx-0 aspect-[9/16] w-full max-w-[140px] shrink-0 overflow-hidden rounded-lg border border-phoenix-border group"
        >
          <Image
            src={poster}
            alt={`Reel Instagram — ${product.name}`}
            fill
            sizes="140px"
            className="object-cover"
            unoptimized={process.env.NODE_ENV === "development"}
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-phoenix-primary text-white">
              <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </Link>
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-phoenix-primary">
            Como nos Reels @globalholdingphoenix
          </p>
          <p className="mt-1 text-sm text-phoenix-text-muted">{hook}</p>
          <a
            href={product.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-phoenix-primary hover:underline"
          >
            Assistir no Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
