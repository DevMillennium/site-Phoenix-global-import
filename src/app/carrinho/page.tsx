import { CartContent } from "@/components/cart/CartContent";

export const metadata = {
  title: "Carrinho",
  description: "Revise seus itens e finalize pelo WhatsApp.",
};

export default function CarrinhoPage() {
  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl">
        Carrinho
      </h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
        Revise os itens abaixo e envie a lista pelo WhatsApp para finalizar seu pedido.
      </p>

      <CartContent />
    </div>
  );
}
