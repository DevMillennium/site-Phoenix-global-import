/** Faixa compacta de reforço de confiança abaixo do hero (informações reais do negócio). */
import { getInstagramHandle } from "@/lib/social";

export function TrustStrip() {
  const ig = getInstagramHandle();
  return (
    <div className="border-b border-phoenix-border bg-phoenix-surface/30" role="region" aria-label="Informações de confiança">
      <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-center text-xs text-phoenix-text-muted sm:text-sm">
        <span>Pagamento seguro via Stripe</span>
        <span className="hidden sm:inline" aria-hidden>
          ·
        </span>
        <span>Envio para todo o Brasil</span>
        <span className="hidden sm:inline" aria-hidden>
          ·
        </span>
        <span>Estoque em Fortaleza — CE</span>
        <span className="hidden md:inline" aria-hidden>
          ·
        </span>
        <span className="hidden md:inline">Ofertas nos Reels @{ig}</span>
      </div>
    </div>
  );
}
