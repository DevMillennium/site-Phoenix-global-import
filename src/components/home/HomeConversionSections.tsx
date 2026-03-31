"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { homeFaqItems, siteStrategy, socialProofItems } from "@/lib/site-strategy";

const sectionReveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 },
};

export function HomeConversionSections() {
  return (
    <>
      <section className="border-y border-phoenix-border bg-phoenix-surface/40" aria-labelledby="home-problema-solucao">
        <div className="container grid gap-8 py-12 sm:py-16 md:grid-cols-2 md:py-20">
          <motion.article {...sectionReveal}>
            <h2 id="home-problema-solucao" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
              Comprar tecnologia importada no Brasil nao precisa ser arriscado
            </h2>
            <p className="mt-4 text-phoenix-text-muted">
              {siteStrategy.icpPrimario.dores[0]} {siteStrategy.icpPrimario.dores[1]}
            </p>
          </motion.article>
          <motion.article {...sectionReveal}>
            <h3 className="font-display text-xl font-semibold text-phoenix-text md:text-2xl">Nossa solucao</h3>
            <p className="mt-4 text-phoenix-text-muted">{siteStrategy.propostaDeValor}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href="/produtos"
                size="md"
                trackingEvent="cta_click"
                trackingPayload={{ source: "home_problem_solution", action: "explorar_catalogo", destination: "/produtos" }}
              >
                Explorar catalogo
              </Button>
              <Button
                href="/contato#cotacao"
                variant="outline"
                size="md"
                trackingEvent="cta_click"
                trackingPayload={{
                  source: "home_problem_solution",
                  action: "falar_com_especialista",
                  destination: "/contato#cotacao",
                }}
              >
                Falar com especialista
              </Button>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="container py-12 sm:py-16 md:py-20" aria-labelledby="home-beneficios">
        <motion.div {...sectionReveal} className="max-w-2xl">
          <h2 id="home-beneficios" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
            Diferenciais que reduzem atrito e aceleram a decisao
          </h2>
        </motion.div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {siteStrategy.diferenciais.map((item) => (
            <motion.li
              key={item}
              {...sectionReveal}
              className="rounded-xl border border-phoenix-border bg-phoenix-card/60 p-5 text-sm text-phoenix-text-muted"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="border-y border-phoenix-border bg-phoenix-surface/30" aria-labelledby="home-prova-social">
        <div className="container py-12 sm:py-16 md:py-20">
          <motion.h2
            {...sectionReveal}
            id="home-prova-social"
            className="font-display text-2xl font-bold text-phoenix-text md:text-3xl"
          >
            Prova de operacao real
          </motion.h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {socialProofItems.map((item) => (
              <motion.li
                key={item.label}
                {...sectionReveal}
                className="rounded-xl border border-phoenix-border bg-phoenix-card p-5 text-center"
              >
                <p className="font-display text-3xl font-bold text-phoenix-primary">{item.value}</p>
                <p className="mt-1 text-sm text-phoenix-text-muted">{item.label}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-12 sm:py-16 md:py-20" aria-labelledby="home-faq">
        <motion.h2 {...sectionReveal} id="home-faq" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
          Perguntas frequentes
        </motion.h2>
        <div className="mt-8 space-y-4">
          {homeFaqItems.map((item) => (
            <motion.details
              key={item.question}
              {...sectionReveal}
              className="group rounded-xl border border-phoenix-border bg-phoenix-card/60 p-5"
            >
              <summary className="cursor-pointer list-none pr-6 text-base font-medium text-phoenix-text">
                {item.question}
              </summary>
              <p className="mt-3 text-sm text-phoenix-text-muted">{item.answer}</p>
            </motion.details>
          ))}
        </div>
      </section>

      <section className="border-t border-phoenix-border bg-phoenix-surface/50" aria-labelledby="home-cta-final">
        <div className="container py-12 text-center sm:py-16 md:py-20">
          <motion.div {...sectionReveal} className="mx-auto max-w-2xl">
            <h2 id="home-cta-final" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
              Pronto para comprar com mais seguranca e velocidade?
            </h2>
            <p className="mt-3 text-phoenix-text-muted">
              Acesse o catalogo para pronta entrega ou envie sua cotacao para atendimento especializado.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/produtos"
                size="lg"
                trackingEvent="cta_click"
                trackingPayload={{ source: "home_final_cta", action: "ver_produtos_agora", destination: "/produtos" }}
              >
                Ver produtos agora
              </Button>
              <Button
                href="/contato#cotacao"
                variant="outline"
                size="lg"
                trackingEvent="cta_click"
                trackingPayload={{ source: "home_final_cta", action: "pedir_cotacao", destination: "/contato#cotacao" }}
              >
                Pedir cotacao
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
