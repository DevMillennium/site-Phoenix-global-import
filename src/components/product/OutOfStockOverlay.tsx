"use client";

/** Tarja visual sobre a imagem quando o produto não está disponível para venda imediata. */
export function OutOfStockOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-phoenix-dark/70 via-phoenix-dark/35 to-phoenix-dark/50"
      aria-hidden
    >
      <div className="rotate-[-10deg] rounded-md border-2 border-white/95 bg-red-700 px-4 py-2.5 shadow-xl sm:px-6 sm:py-3">
        <span className="font-display text-base font-bold tracking-[0.2em] text-white sm:text-lg">
          ESGOTADO
        </span>
      </div>
    </div>
  );
}
