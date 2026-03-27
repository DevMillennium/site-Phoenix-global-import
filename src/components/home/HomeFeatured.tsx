"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";

interface HomeFeaturedProps {
  featured: Product[];
}

export function HomeFeatured({ featured }: HomeFeaturedProps) {
  return (
    <>
      <section className="container py-12 sm:py-16 md:py-24" aria-labelledby="destaques">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="destaques" className="font-display text-2xl font-bold text-phoenix-text md:text-3xl">
              Destaques
            </h2>
            <p className="mt-1 text-phoenix-text-muted">Os mais pedidos com pronta entrega</p>
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
              Solicite cotação do produto que você precisa. Atendemos pedidos especiais e encomendas.
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
