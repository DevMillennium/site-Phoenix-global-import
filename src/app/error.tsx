"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-phoenix-text">
        Algo deu errado
      </h1>
      <p className="mt-2 text-phoenix-text-muted">
        Ocorreu um erro ao carregar esta página. Tente novamente.
      </p>
      <Button onClick={reset} className="mt-8">
        Tentar novamente
      </Button>
    </div>
  );
}
