import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Sobre nós",
  description:
    "Phoenix Global Import: eletrônicos e tecnologia importados. Estoque em Fortaleza, envio para todo o Brasil.",
};

export default function SobrePage() {
  return (
    <div className="container py-6 sm:py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl">
          Sobre a Phoenix Global Import
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-phoenix-text-muted">
          Eletrônicos e tecnologia com foco em qualidade e entrega.
        </p>

        <div className="mt-10 space-y-6 text-phoenix-text-muted">
          <p>
            A Phoenix Global Import atua na importação e venda de eletrônicos e
            tecnologia. Nosso estoque fica em Fortaleza, Ceará, e enviamos para
            todo o Brasil.
          </p>
          <p>
            Trabalhamos com marcas consolidadas e produtos originais, além de
            itens seminovos selecionados. Destaques como AirPods, câmeras,
            gaming, wearables e acessórios estão sempre disponíveis com pronta
            entrega.
          </p>
          <p>
            Para itens que não estão na vitrine, oferecemos cotação sob demanda:
            envie o produto que você precisa e retornamos com valor e prazo.
          </p>
        </div>

        <ul className="mt-10 space-y-3 text-phoenix-text">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-phoenix-primary" aria-hidden />
            Estoque em Fortaleza, Ceará
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-phoenix-primary" aria-hidden />
            Envio para todo o Brasil
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-phoenix-primary" aria-hidden />
            Produtos originais e seminovos
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-phoenix-primary" aria-hidden />
            Cotação sob demanda
          </li>
        </ul>

        <div className="mt-10">
          <Button href="/contato">Entrar em contato</Button>
        </div>
      </div>
    </div>
  );
}
