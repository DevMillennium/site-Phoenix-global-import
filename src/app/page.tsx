"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Vídeo de abertura — responsivo: altura dinâmica e offset do vídeo só em telas maiores */}
      <section className="relative min-h-[50dvh] sm:min-h-[60dvh] md:min-h-[70vh] w-full overflow-hidden border-b border-phoenix-border bg-phoenix-dark">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-top md:object-center md:translate-x-[5rem] lg:translate-x-[10cm]"
          aria-label="Vídeo de abertura Phoenix Global Import"
        >
          <source src="/hero-abertura.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-phoenix-dark/90 via-phoenix-dark/40 to-transparent" aria-hidden />
        <div className="container relative z-10 flex min-h-[50dvh] sm:min-h-[60dvh] md:min-h-[70vh] flex-col justify-end pb-8 pt-6 sm:pb-12 sm:pt-8 md:pb-16 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-3xl font-bold tracking-tight text-phoenix-text xs:text-4xl md:text-5xl lg:text-6xl">
              Eletrônicos e tecnologia{" "}
              <span className="bg-gradient-phoenix bg-clip-text text-transparent">
                importados
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base text-phoenix-text-muted sm:text-lg md:text-xl">
              Estoque em Fortaleza, Ceará. Enviamos para todo o Brasil.
              Pronta entrega, produtos originais e as melhores marcas.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Button href="/produtos" size="lg">
                Ver produtos
              </Button>
              <Button href="/contato#cotacao" variant="outline" size="lg">
                Solicitar cotação
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 sm:py-16 md:py-24" aria-labelledby="destaques">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="destaques" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
              Destaques
            </h2>
            <p className="mt-1 text-phoenix-text-muted">
              Os mais pedidos com pronta entrega
            </p>
          </div>
          <Link
            href="/produtos"
            className="text-sm font-medium text-phoenix-primary hover:text-phoenix-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary rounded"
          >
            Ver todos →
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
          {featured.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-phoenix-border bg-phoenix-surface/50">
        <div className="container py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
              Não encontrou o que procura?
            </h2>
            <p className="mt-3 text-phoenix-text-muted">
              Solicite cotação do produto que você precisa. Atendemos pedidos
              especiais e encomendas.
            </p>
            <Button href="/contato#cotacao" className="mt-6" size="lg">
              Solicitar cotação
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
