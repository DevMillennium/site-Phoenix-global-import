"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group"
    >
      <Link
        href={`/produtos/${product.slug}`}
        className="block rounded-xl bg-phoenix-card border border-phoenix-border overflow-hidden hover:border-phoenix-primary/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-square bg-phoenix-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized={process.env.NODE_ENV === "development"}
          />
          {product.videoUrl && (
            <span
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
              aria-hidden
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-phoenix-text line-clamp-2 mb-1 group-hover:text-phoenix-primary-hover transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-phoenix-text-muted line-clamp-1 mb-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-phoenix-primary">
              {product.pricePix ? (
                <>
                  {formatPrice(product.pricePix)}{" "}
                  <span className="text-xs font-normal text-phoenix-text-muted">no PIX</span>
                </>
              ) : (
                formatPrice(product.price)
              )}
            </span>
            {product.views != null && product.views >= 1000 && (
              <span className="flex items-center gap-1 text-xs text-phoenix-text-muted" aria-label={`${product.views} visualizações`}>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {product.views >= 1000
                  ? `${(product.views / 1000).toFixed(1).replace(".", ",")} mil`
                  : product.views}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
