import Link from "next/link";

export const metadata = {
  title: "Envio e entrega",
  description:
    "Política de envio da Phoenix Global Import — Fortaleza e entrega em todo o Brasil.",
};

export default function PoliticaEnvioPage() {
  return (
    <div className="container py-10 sm:py-14 max-w-3xl">
      <nav className="text-sm text-phoenix-text-muted mb-6">
        <Link href="/" className="hover:text-phoenix-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-phoenix-text">Envio e entrega</span>
      </nav>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-phoenix-text">Envio e entrega</h1>
      <div className="mt-8 space-y-4 text-phoenix-text-muted leading-relaxed">
        <p>
          A Phoenix Global Import opera com estoque em <strong className="text-phoenix-text">Fortaleza (CE)</strong>{" "}
          e realiza envios para diversas regiões do Brasil, conforme disponibilidade de transportadoras e tipo de
          produto.
        </p>
        <p>
          <strong className="text-phoenix-text">Prazos e custos de frete</strong> são informados no ato do pedido,
          após confirmação do endereço e da forma de pagamento — inclusive quando a finalização ocorre pelo WhatsApp.
        </p>
        <p>
          Em compras pelo checkout com cartão (Stripe), o valor pago refere-se aos produtos conforme o catálogo;{" "}
          <strong className="text-phoenix-text">frete e logística</strong> podem ser combinados em seguida com nossa
          equipe, garantindo transparência total antes do despacho.
        </p>
        <p>
          Dúvidas?{" "}
          <Link href="/contato" className="text-phoenix-primary hover:underline">
            Fale conosco
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
