import Link from "next/link";

export const metadata = {
  title: "Troca e devolução",
  description: "Política de troca e devolução da Phoenix Global Import.",
};

export default function PoliticaTrocaPage() {
  return (
    <div className="container py-10 sm:py-14 max-w-3xl">
      <nav className="text-sm text-phoenix-text-muted mb-6">
        <Link href="/" className="hover:text-phoenix-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-phoenix-text">Troca e devolução</span>
      </nav>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-phoenix-text">Troca e devolução</h1>
      <div className="mt-8 space-y-4 text-phoenix-text-muted leading-relaxed">
        <p>
          Cada categoria de produto (eletrônicos lacrados, itens abertos para teste, cosméticos etc.) possui regras
          específicas de <strong className="text-phoenix-text">troca e devolução</strong>, sempre em conformidade com o
          Código de Defesa do Consumidor.
        </p>
        <p>
          Em geral, solicitamos que o produto seja mantido em estado adequado à análise, com embalagens e acessórios
          quando aplicável, e que o contato para abertura de solicitação seja feito em até{" "}
          <strong className="text-phoenix-text">7 (sete) dias corridos</strong> após o recebimento, salvo disposição
          legal diversa para o tipo de mercadoria.
        </p>
        <p>
          Para casos concretos, envie mensagem pelo{" "}
          <Link href="/contato" className="text-phoenix-primary hover:underline">
            WhatsApp ou formulário de contato
          </Link>
          , informando número do pedido e fotos do produto quando necessário.
        </p>
      </div>
    </div>
  );
}
