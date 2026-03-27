"use client";

import { getWhatsAppLink } from "@/lib/env";

interface LinkWhatsAppProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const FALLBACK_MESSAGE = "Olá! Gostaria de mais informações.";

/** Abre o link do WhatsApp (funciona dentro de iframe, ex.: emulador mobile). */
export function LinkWhatsApp({ href, children, className, ariaLabel }: LinkWhatsAppProps) {
  const openWhatsApp = (e: React.MouseEvent) => {
    const link = href && href.startsWith("https://wa.me/") ? href : getWhatsAppLink(FALLBACK_MESSAGE);
    if (!link.startsWith("https://wa.me/")) return;
    e.preventDefault();
    const w = typeof window !== "undefined" ? window.top ?? window : null;
    if (w) w.open(link, "_blank", "noopener,noreferrer");
  };

  const validHref = href && href.startsWith("https://wa.me/") ? href : getWhatsAppLink(FALLBACK_MESSAGE);

  return (
    <a
      href={validHref}
      onClick={openWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
