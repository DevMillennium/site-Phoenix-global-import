"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/produtos", label: "Produtos" },
  { href: "/contato", label: "Contato" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-[9999] isolate w-full border-b border-phoenix-border bg-phoenix-dark/95 backdrop-blur supports-[backdrop-filter]:bg-phoenix-dark/80 pointer-events-auto pt-[env(safe-area-inset-top)]">
      <div className="container flex h-14 min-h-touch sm:h-16 items-center justify-between gap-2 relative z-[1] pointer-events-auto">
        <Link
          href="/"
          className="relative z-[2] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary rounded min-w-0 cursor-pointer pointer-events-auto"
          aria-label="Phoenix Global - Início"
        >
          <Image
            src="/logo-phoenix-global.png"
            alt="Phoenix Global - Import and Export"
            width={160}
            height={48}
            className="h-9 w-auto max-w-[140px] sm:h-10 sm:max-w-[160px] md:h-12 object-contain pointer-events-none select-none"
            priority
          />
        </Link>

        <nav className="relative z-[2] hidden md:flex items-center gap-1 shrink-0 pointer-events-auto" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative z-[2] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer pointer-events-auto",
                pathname === item.href
                  ? "text-phoenix-primary bg-phoenix-primary/10"
                  : "text-phoenix-text-muted hover:text-phoenix-text hover:bg-phoenix-card"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-[2] flex items-center gap-3 shrink-0 pointer-events-auto">
          <Link
            href="/carrinho"
            className="relative z-[2] flex items-center justify-center min-h-touch min-w-touch w-12 h-12 rounded-lg text-phoenix-text-muted hover:text-phoenix-text hover:bg-phoenix-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary cursor-pointer pointer-events-auto"
            aria-label={totalItems > 0 ? `Ver carrinho (${totalItems} itens)` : "Ver carrinho"}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-phoenix-primary px-1.5 text-xs font-medium text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="relative z-[2] md:hidden flex items-center justify-center min-h-touch min-w-touch w-12 h-12 rounded-lg text-phoenix-text-muted hover:text-phoenix-text hover:bg-phoenix-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary cursor-pointer pointer-events-auto"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen ? "true" : "false"}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-phoenix-border bg-phoenix-surface"
          >
            <nav className="container flex flex-col py-4 gap-1 px-4 sm:px-6" aria-label="Menu mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "min-h-touch flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-phoenix-primary bg-phoenix-primary/10"
                      : "text-phoenix-text-muted hover:text-phoenix-text hover:bg-phoenix-card"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
