import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Carrinho",
  description: "Revise seus itens e finalize pelo WhatsApp.",
};

export default function CarrinhoPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-display text-3xl font-bold text-phoenix-text">
        Carrinho
      </h1>
      <p className="mt-2 text-phoenix-text-muted">
        Finalize seu pedido pelo WhatsApp. Adicione os produtos que deseja e envie a mensagem.
      </p>

      <div className="mt-12 rounded-xl border border-phoenix-border bg-phoenix-card p-8 text-center">
        <p className="text-phoenix-text-muted">
          Seu carrinho está vazio. Escolha produtos na loja e entre em contato pelo WhatsApp para fechar o pedido.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button href="/produtos">Ver produtos</Button>
          <Button href="/contato" variant="outline">
            Falar no WhatsApp
          </Button>
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
