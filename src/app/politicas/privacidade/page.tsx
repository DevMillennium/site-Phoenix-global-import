import Link from "next/link";

export const metadata = {
  title: "Privacidade",
  description: "Política de privacidade e dados da Phoenix Global Import.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="container py-10 sm:py-14 max-w-3xl">
      <nav className="text-sm text-phoenix-text-muted mb-6">
        <Link href="/" className="hover:text-phoenix-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-phoenix-text">Privacidade</span>
      </nav>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-phoenix-text">Privacidade</h1>
      <div className="mt-8 space-y-4 text-phoenix-text-muted leading-relaxed">
        <p>
          A Phoenix Global Import trata dados pessoais apenas na medida necessária para{" "}
          <strong className="text-phoenix-text">atendimento, vendas, entrega e comunicação</strong> com clientes que
          entram em contato pelo site, WhatsApp ou checkout.
        </p>
        <p>
          Em pagamentos via <strong className="text-phoenix-text">Stripe</strong>, dados de cartão são processados
          diretamente pelo provedor de pagamentos; não armazenamos número completo de cartão em nossos servidores.
        </p>
        <p>
          Mensagens enviadas pelo WhatsApp ficam sujeitas aos termos da plataforma Meta/WhatsApp. Cookies e métricas de
          navegação, quando utilizados, visam melhorar a experiência e o desempenho da loja.
        </p>
        <p>
          Para solicitações relacionadas a dados, utilize o{" "}
          <Link href="/contato" className="text-phoenix-primary hover:underline">
            contato oficial
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
