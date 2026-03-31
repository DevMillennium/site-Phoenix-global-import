"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  slug: string;
  name: string;
  price: number;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  slug,
  name,
  price,
  quantity = 1,
  className,
  children,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState(false);

  function handleClick() {
    addItem({ slug, name, price, quantity });
    trackEvent("add_to_cart", {
      source: "product_page",
      item_slug: slug,
      item_name: name,
      quantity,
      value: Number((price * quantity).toFixed(2)),
      currency: "BRL",
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2000);
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center min-h-touch gap-2 rounded-lg border border-phoenix-border bg-phoenix-card px-5 py-3 sm:px-6 font-medium text-phoenix-text hover:bg-phoenix-surface hover:border-phoenix-primary/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation",
          className
        )}
        aria-label={`Adicionar ${name} ao carrinho`}
      >
        {feedback ? (
          <>
            <svg className="h-5 w-5 text-phoenix-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Adicionado ao carrinho
          </>
        ) : (
          children ?? "Adicionar ao carrinho"
        )}
      </button>
      {feedback && (
        <p className="text-xs text-phoenix-success" role="status">
          Item adicionado. Veja o carrinho para enviar pelo WhatsApp.
        </p>
      )}
    </div>
  );
}
