"use client";

import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types/product";

const badgeConfig: Record<
  ProductBadge,
  { label: string; className: string }
> = {
  "pronta-entrega": {
    label: "Pronta entrega!",
    className: "bg-phoenix-success/20 text-emerald-300 border-phoenix-success/40",
  },
  original: {
    label: "100% original",
    className: "bg-phoenix-primary/20 text-phoenix-primary-hover border-phoenix-primary/40",
  },
  seminova: {
    label: "Seminova",
    className: "bg-phoenix-gold/20 text-phoenix-gold border-phoenix-gold/40",
  },
  promocao: {
    label: "Super promoção!",
    className: "bg-phoenix-accent/20 text-red-300 border-phoenix-accent/40",
  },
  destaque: {
    label: "Destaque",
    className: "bg-phoenix-gold/20 text-phoenix-gold border-phoenix-gold/40",
  },
};

interface BadgeProps {
  type: ProductBadge;
  className?: string;
}

export function Badge({ type, className }: BadgeProps) {
  const config = badgeConfig[type];
  if (!config) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
