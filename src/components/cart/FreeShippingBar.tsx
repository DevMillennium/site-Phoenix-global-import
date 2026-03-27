"use client";

import { formatPrice } from "@/lib/utils";
import { FRETE_GRATIS_PEDIDO_MINIMO_BRL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FreeShippingBarProps {
  subtotalBrl: number;
  className?: string;
}

export function FreeShippingBar({ subtotalBrl, className }: FreeShippingBarProps) {
  const goal = FRETE_GRATIS_PEDIDO_MINIMO_BRL;
  const pct = Math.min(100, (subtotalBrl / goal) * 100);
  const falta = Math.max(0, goal - subtotalBrl);
  const reached = subtotalBrl >= goal;
  const pctRounded = Math.min(100, Math.max(0, Math.round(pct)));

  return (
    <div
      className={cn(
        "rounded-xl border border-phoenix-border bg-phoenix-surface/80 p-4",
        className
      )}
    >
      <p className="text-sm text-phoenix-text">
        {reached ? (
          <span className="font-medium text-phoenix-success">
            Parabéns! Seu pedido atinge a faixa para frete grátis (estimativa — confirme no WhatsApp).
          </span>
        ) : (
          <>
            Faltam{" "}
            <span className="font-semibold text-phoenix-primary">{formatPrice(falta)}</span> para
            atingir <span className="font-medium">{formatPrice(goal)}</span> e qualificar para{" "}
            <span className="font-medium">frete grátis</span> (conforme região e campanha).
          </>
        )}
      </p>
      <div className="mt-3 w-full">
        <label htmlFor="frete-gratis-progresso" className="sr-only">
          Progresso em direção ao frete grátis: {pctRounded} por cento do valor alvo
        </label>
        <progress
          id="frete-gratis-progresso"
          className={cn(
            "h-2 w-full appearance-none overflow-hidden rounded-full bg-phoenix-card",
            "[&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-phoenix-card",
            "[&::-webkit-progress-value]:rounded-full",
            reached
              ? "[&::-webkit-progress-value]:bg-phoenix-success [&::-moz-progress-bar]:bg-phoenix-success"
              : "[&::-webkit-progress-value]:bg-phoenix-primary [&::-moz-progress-bar]:bg-phoenix-primary"
          )}
          value={pctRounded}
          max={100}
        />
      </div>
    </div>
  );
}
