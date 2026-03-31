"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "sucesso" | "cancelado" | null;

export function PaymentStatusBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const status = searchParams.get("pagamento") as Status;
  const sessionId = searchParams.get("session_id");

  const isSucesso = status === "sucesso";
  const isCancelado = status === "cancelado";
  const show = (isSucesso || isCancelado) && !dismissed;

  const clearParam = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("pagamento");
    const query = next.toString();
    router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(clearParam, 8000);
    return () => clearTimeout(t);
  }, [show, clearParam]);

  useEffect(() => {
    if (!status) return;
    const dedupeKey = `phoenix-payment-event:${status}:${sessionId ?? "no-session"}:${pathname}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(dedupeKey)) return;

    if (status === "sucesso") {
      trackEvent("purchase_success", {
        source: pathname.includes("/carrinho") ? "cart" : "pdp",
        session_id: sessionId ?? "nao_informado",
        page_path: pathname,
      });
    } else if (status === "cancelado") {
      trackEvent("purchase_cancelled", {
        source: pathname.includes("/carrinho") ? "cart" : "pdp",
        session_id: sessionId ?? "nao_informado",
        page_path: pathname,
      });
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(dedupeKey, "1");
    }
  }, [status, sessionId, pathname]);

  function handleDismiss() {
    setDismissed(true);
    clearParam();
  }

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "mb-6 rounded-xl border p-4 flex items-start gap-3",
        isSucesso && "border-phoenix-success bg-phoenix-success/15",
        isCancelado && "border-phoenix-accent bg-phoenix-accent/10"
      )}
    >
      {isSucesso ? (
        <svg className="h-6 w-6 shrink-0 text-phoenix-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="h-6 w-6 shrink-0 text-phoenix-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${isSucesso ? "text-phoenix-success" : "text-phoenix-accent"}`}>
          {isSucesso ? "Pagamento concluído com sucesso." : "Pagamento cancelado."}
        </p>
        <p className="mt-0.5 text-sm text-phoenix-text-muted">
          {isSucesso
            ? "Obrigado pela compra. Em breve você receberá a confirmação."
            : "Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser."}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 p-1 rounded-lg text-phoenix-text-muted hover:text-phoenix-text hover:bg-phoenix-card transition-colors"
        aria-label="Fechar mensagem"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
