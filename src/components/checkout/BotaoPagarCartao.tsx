"use client";

import { useState } from "react";

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

  async function handleClick() {
    setLoading(true);
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
      alert(e instanceof Error ? e.message : "Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
      aria-busy={loading}
      aria-label={loading ? "Abrindo página de pagamento..." : "Pagar com cartão"}
    >
      {loading ? "Abrindo checkout..." : children ?? "Pagar com cartão"}
    </button>
  );
}
