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
      <section className="relative overflow-hidden border-b border-phoenix-border">
        <div className="absolute inset-0 bg-gradient-to-b from-phoenix-primary/10 via-transparent to-transparent" aria-hidden />
        <div className="container relative mx-auto px-4 py-20 md:py-28 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-phoenix-text md:text-5xl lg:text-6xl">
              Eletrônicos e tecnologia{" "}
              <span className="bg-gradient-phoenix bg-clip-text text-transparent">
                importados
              </span>
            </h1>
            <p className="mt-4 text-lg text-phoenix-text-muted md:text-xl">
              Estoque em Fortaleza, Ceará. Enviamos para todo o Brasil.
              Pronta entrega, produtos originais e as melhores marcas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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

      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24" aria-labelledby="destaques">
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
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
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
