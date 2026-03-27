"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface BotaoPagarCartaoCarrinhoProps {
  className?: string;
}

/**
 * Inicia Stripe Checkout com os itens do carrinho (preços validados no servidor).
 */
export function BotaoPagarCartaoCarrinho({ className }: BotaoPagarCartaoCarrinhoProps) {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (items.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar pagamento");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = items.length === 0 || loading;

  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center min-h-touch gap-2 rounded-lg border border-phoenix-primary px-5 py-3 sm:px-6 font-medium text-phoenix-primary hover:bg-phoenix-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation disabled:opacity-50 disabled:pointer-events-none",
          className,
          error && "border-phoenix-accent/50"
        )}
        {...(loading ? { "aria-busy": true as const } : {})}
        {...(error ? { "aria-invalid": true as const } : {})}
        aria-describedby={error ? "checkout-cart-error" : undefined}
        aria-label={loading ? "Abrindo checkout do carrinho..." : "Pagar carrinho com cartão"}
      >
        {loading ? "Abrindo checkout..." : "Pagar carrinho com cartão"}
      </button>
      <span className="text-xs text-phoenix-text-muted">
        Pagamento seguro via Stripe · mesmo total do carrinho
      </span>
      {error && (
        <p id="checkout-cart-error" role="alert" className="text-sm text-phoenix-accent">
          {error}
        </p>
      )}
    </div>
  );
}
