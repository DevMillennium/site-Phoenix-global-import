"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface BotaoPagarCartaoProps {
  slug: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function BotaoPagarCartao({
  slug,
  quantity = 1,
  className = "",
  children,
}: BotaoPagarCartaoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    trackEvent("begin_checkout", {
      source: "pdp",
      mode: "single_product",
      item_slug: slug,
      quantity,
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar pagamento");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      trackEvent("checkout_error", {
        source: "pdp",
        mode: "single_product",
        item_slug: slug,
      });
      setError(e instanceof Error ? e.message : "Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const ariaProps: { "aria-busy": "true" | "false"; "aria-invalid": "true" | "false" } = {
    "aria-busy": loading ? "true" : "false",
    "aria-invalid": error ? "true" : "false",
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(className, error && "border-phoenix-accent/50")}
        {...ariaProps}
        aria-describedby={error ? "cartao-error" : undefined}
        aria-label={loading ? "Abrindo página de pagamento..." : "Pagar com cartão"}
      >
        {loading ? "Abrindo checkout..." : children ?? "Pagar com cartão"}
      </button>
      {error && (
        <p
          id="cartao-error"
          role="alert"
          className="text-sm text-phoenix-accent flex items-center gap-1.5"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
