import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/env";

export const metadata = {
  title: "Carrinho",
  description: "Revise seus itens e finalize pelo WhatsApp.",
};

const linkWhatsAppCarrinho = getWhatsAppLink(
  "Olá! Gostaria de finalizar meu pedido. Segue minha lista de produtos da Phoenix Global Import."
);

export default function CarrinhoPage() {
  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl">
        Carrinho
      </h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
        Finalize seu pedido pelo WhatsApp. Adicione os produtos que deseja e envie a mensagem.
      </p>

      <div className="mt-8 sm:mt-12 rounded-xl border border-phoenix-border bg-phoenix-card p-6 sm:p-8 text-center">
        <p className="text-phoenix-text-muted">
          Seu carrinho está vazio. Escolha produtos na loja e entre em contato pelo WhatsApp para fechar o pedido.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
          <Button href="/produtos" size="lg">Ver produtos</Button>
          <a
            href={linkWhatsAppCarrinho}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-touch rounded-lg font-medium border border-phoenix-primary text-phoenix-primary hover:bg-phoenix-primary/10 transition-colors px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phoenix-primary touch-manipulation"
            aria-label="Abrir WhatsApp para finalizar pedido"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-phoenix-border bg-phoenix-surface/50 p-6">
        <h2 className="font-semibold text-phoenix-text">Como comprar</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-phoenix-text-muted">
          <li>Navegue pelos produtos e anote os que deseja (ou use o botão &quot;Comprar no WhatsApp&quot; na página do produto).</li>
          <li>Entre em contato pelo WhatsApp informando o nome e a quantidade dos itens.</li>
          <li>Receba o valor total e as opções de pagamento (PIX, cartão).</li>
          <li>Estoque em Fortaleza — enviamos para todo o Brasil.</li>
        </ol>
      </div>
    </div>
  );
}
