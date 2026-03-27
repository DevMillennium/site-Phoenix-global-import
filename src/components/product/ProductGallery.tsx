"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

export function ProductGallery({ images, alt, priority }: ProductGalleryProps) {
  const list = images.length > 0 ? images : ["/logo-phoenix-global.png"];
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, list.length - 1);
  const mainSrc = list[safeIndex] ?? list[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-phoenix-card border border-phoenix-border">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
          priority={priority}
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>
      {list.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Miniaturas da galeria">
          {list.map((src, i) => {
            const selected = i === safeIndex;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary",
                  selected
                    ? "border-phoenix-primary"
                    : "border-phoenix-border hover:border-phoenix-primary/50"
                )}
                aria-label={
                  selected
                    ? `Imagem ${i + 1} de ${list.length}, em exibição`
                    : `Mostrar imagem ${i + 1} de ${list.length}`
                }
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized={process.env.NODE_ENV === "development"}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
