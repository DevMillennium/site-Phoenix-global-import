"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function LayoutConditional({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmulador = pathname?.startsWith("/emulador");
  const isPaginaTeste = pathname?.startsWith("/teste-alteracoes");
  const semLayoutSite = isEmulador || isPaginaTeste;

  if (semLayoutSite) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 relative z-0 isolate">{children}</main>
      <Footer />
    </>
  );
}
