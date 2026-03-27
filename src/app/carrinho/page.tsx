import { Suspense } from "react";
import { CartContent } from "@/components/cart/CartContent";
import { PaymentStatusBanner } from "@/components/checkout/PaymentStatusBanner";

export const metadata = {
  title: "Carrinho",
  description:
    "Revise seus itens e finalize com cartão (Stripe) ou envie a lista pelo WhatsApp.",
};

export default function CarrinhoPage() {
  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <Suspense fallback={null}>
        <PaymentStatusBanner />
      </Suspense>

      <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl">
        Carrinho
      </h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
        Revise os itens e finalize com cartão (Stripe) ou envie a lista pelo WhatsApp para combinar PIX e frete.
      </p>

      <CartContent />
    </div>
  );
}
