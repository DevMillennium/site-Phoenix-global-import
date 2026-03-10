"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/env";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { LinkWhatsApp } from "@/components/checkout/LinkWhatsApp";

export function CartContent() {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <>
        <div className="mt-8 sm:mt-12 rounded-xl border border-phoenix-border bg-phoenix-card p-6 sm:p-8 text-center">
          <p className="text-phoenix-text-muted">
            Seu carrinho está vazio. Use &quot;Adicionar ao carrinho&quot; na página de cada produto e depois envie a lista pelo WhatsApp para finalizar.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Button href="/produtos" size="lg">
              Ver produtos
            </Button>
            <LinkWhatsApp
              href={getWhatsAppLink("Olá! Gostaria de mais informações sobre os produtos da Phoenix Global Import.")}
              className="inline-flex items-center justify-center min-h-touch rounded-lg font-medium border border-phoenix-primary text-phoenix-primary hover:bg-phoenix-primary/10 transition-colors px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phoenix-primary touch-manipulation"
              ariaLabel="Abrir WhatsApp para falar com a loja"
            >
              Falar no WhatsApp
            </LinkWhatsApp>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-phoenix-border bg-phoenix-surface/50 p-6">
          <h2 className="font-semibold text-phoenix-text">Como comprar</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-phoenix-text-muted">
            <li>Navegue pelos produtos e use &quot;Adicionar ao carrinho&quot; nos itens desejados.</li>
            <li>Abra o carrinho e clique em &quot;Enviar lista no WhatsApp&quot; para enviar seu pedido.</li>
            <li>Receba o valor total e as opções de pagamento (PIX, cartão).</li>
            <li>Estoque em Fortaleza — enviamos para todo o Brasil.</li>
          </ol>
        </div>
      </>
    );
  }

  const messageLines = [
    "Olá! Gostaria de finalizar meu pedido. Segue minha lista da Phoenix Global Import:",
    "",
    ...items.map(
      (i) => `• ${i.name} x ${i.quantity} - ${formatPrice(i.price * i.quantity)}`
    ),
    "",
    `Total: ${formatPrice(totalAmount)}`,
  ];
  const whatsAppMessage = messageLines.join("\n");
  const whatsAppHref = getWhatsAppLink(whatsAppMessage);

  return (
    <>
      <div className="mt-8 sm:mt-12 rounded-xl border border-phoenix-border bg-phoenix-card overflow-hidden">
        <ul className="divide-y divide-phoenix-border" role="list">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/produtos/${item.slug}`}
                  className="font-medium text-phoenix-text hover:text-phoenix-primary transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-phoenix-text-muted mt-0.5">
                  {formatPrice(item.price)} cada · {item.quantity}{" "}
                  {item.quantity === 1 ? "unidade" : "unidades"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-phoenix-border bg-phoenix-surface">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center text-phoenix-text-muted hover:text-phoenix-text transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium text-phoenix-text" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center text-phoenix-text-muted hover:text-phoenix-text transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                <span className="text-base font-semibold text-phoenix-primary min-w-[5rem] text-right">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="p-2 text-phoenix-text-muted hover:text-phoenix-accent transition-colors rounded-lg hover:bg-phoenix-surface"
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-phoenix-border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-lg font-semibold text-phoenix-text">
            Total ({totalItems} {totalItems === 1 ? "item" : "itens"}):{" "}
            <span className="text-phoenix-primary">{formatPrice(totalAmount)}</span>
          </p>
          <LinkWhatsApp
            href={whatsAppHref}
            className="inline-flex items-center justify-center min-h-touch gap-2 rounded-lg bg-phoenix-success px-6 py-3 font-medium text-white hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary touch-manipulation"
            ariaLabel="Enviar lista do carrinho pelo WhatsApp"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar lista no WhatsApp
          </LinkWhatsApp>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-phoenix-border bg-phoenix-surface/50 p-6">
        <h2 className="font-semibold text-phoenix-text">Como comprar</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-phoenix-text-muted">
          <li>Revise os itens acima e use &quot;Enviar lista no WhatsApp&quot; para enviar seu pedido.</li>
          <li>Receba o valor total e as opções de pagamento (PIX, cartão).</li>
          <li>Estoque em Fortaleza — enviamos para todo o Brasil.</li>
        </ol>
      </div>
    </>
  );
}
