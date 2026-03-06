import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Phoenix Global Import. WhatsApp, cotação e localização em Fortaleza.",
};

const whatsappNumber = "5585999999999";
const whatsappMessage = encodeURIComponent(
  "Olá! Gostaria de mais informações sobre os produtos da Phoenix Global Import."
);

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-phoenix-text">
          Contato
        </h1>
        <p className="mt-2 text-phoenix-text-muted">
          Estoque em Fortaleza, Ceará. Enviamos para todo o Brasil.
        </p>

        <section className="mt-10 space-y-10" id="cotacao" aria-labelledby="cotacao-heading">
          <div>
            <h2 id="cotacao-heading" className="font-display text-xl font-semibold text-phoenix-text">
              Solicitar cotação
            </h2>
            <p className="mt-2 text-phoenix-text-muted">
              Não encontrou o produto na loja? Envie o nome ou link do produto que você precisa e retornamos com o valor e prazo.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de solicitar cotação para o seguinte produto: ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex"
            >
              <Button size="lg">Abrir WhatsApp para cotação</Button>
            </a>
          </div>

          <div className="rounded-xl border border-phoenix-border bg-phoenix-card p-6">
            <h2 className="font-display text-xl font-semibold text-phoenix-text">
              Atendimento
            </h2>
            <p className="mt-2 text-phoenix-text-muted">
              Dúvidas, pedidos ou parcerias: fale conosco pelo WhatsApp.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-phoenix-success/20 px-4 py-2.5 text-phoenix-text hover:bg-phoenix-success/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-phoenix-text">
              Localização
            </h2>
            <p className="mt-2 text-phoenix-text-muted">
              Estoque em Fortaleza, Ceará. Enviamos para todo o Brasil.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
