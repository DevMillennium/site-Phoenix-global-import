"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HomeHero() {
  return (
    <section className="relative min-h-[50dvh] sm:min-h-[60dvh] md:min-h-[70vh] w-full overflow-hidden border-b border-phoenix-border bg-phoenix-dark">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/logo-phoenix-global.png"
        className="absolute inset-0 h-full w-full object-cover object-top md:object-center md:translate-x-[5rem] lg:translate-x-[10cm]"
        aria-label="Vídeo de abertura Phoenix Global Import"
      >
        <source src="/hero-abertura.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-t from-phoenix-dark/90 via-phoenix-dark/40 to-transparent"
        aria-hidden
      />
      <div className="container relative z-10 flex min-h-[50dvh] sm:min-h-[60dvh] md:min-h-[70vh] flex-col justify-end pb-8 pt-6 sm:pb-12 sm:pt-8 md:pb-16 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-phoenix-text xs:text-4xl md:text-5xl lg:text-6xl">
            Tecnologia importada{" "}
            <span className="bg-gradient-phoenix bg-clip-text text-transparent">original</span>, pronta entrega
          </h1>
          <p className="mt-3 sm:mt-4 text-base text-phoenix-text-muted sm:text-lg md:text-xl">
            Estoque local em Fortaleza, envio para todo o Brasil e suporte consultivo no WhatsApp para compra sem risco.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
            <li className="rounded-full border border-phoenix-border bg-phoenix-card/80 px-3 py-1.5 text-phoenix-text">
              Produtos originais
            </li>
            <li className="rounded-full border border-phoenix-border bg-phoenix-card/80 px-3 py-1.5 text-phoenix-text">
              Estoque em Fortaleza
            </li>
            <li className="rounded-full border border-phoenix-border bg-phoenix-card/80 px-3 py-1.5 text-phoenix-text">
              Pagamento seguro via Stripe
            </li>
          </ul>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Button
              href="/produtos"
              size="lg"
              trackingEvent="cta_click"
              trackingPayload={{ source: "home_hero", action: "ver_pronta_entrega", destination: "/produtos" }}
            >
              Ver pronta entrega
            </Button>
            <Button
              href="/contato#cotacao"
              variant="outline"
              size="lg"
              trackingEvent="cta_click"
              trackingPayload={{ source: "home_hero", action: "cotacao_whatsapp", destination: "/contato#cotacao" }}
            >
              Receber cotação no WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
