import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[50dvh] sm:min-h-[60vh] flex-col items-center justify-center py-12 sm:py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-phoenix-text sm:text-3xl md:text-4xl">
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm sm:text-base text-phoenix-text-muted">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <Button href="/" className="mt-8">
        Voltar ao início
      </Button>
    </div>
  );
}
