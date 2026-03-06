import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-4xl font-bold text-phoenix-text">
        Página não encontrada
      </h1>
      <p className="mt-2 text-phoenix-text-muted">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <Button href="/" className="mt-8">
        Voltar ao início
      </Button>
    </div>
  );
}
