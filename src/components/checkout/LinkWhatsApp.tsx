"use client";

interface LinkWhatsAppProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Abre o link do WhatsApp (funciona dentro de iframe, ex.: emulador mobile). */
export function LinkWhatsApp({ href, children, className, ariaLabel }: LinkWhatsAppProps) {
  const openWhatsApp = (e: React.MouseEvent) => {
    if (!href || !href.startsWith("https://wa.me/")) return;
    e.preventDefault();
    const w = typeof window !== "undefined" ? window.top ?? window : null;
    if (w) w.open(href, "_blank", "noopener,noreferrer");
  };

  const validHref = href && href.startsWith("https://wa.me/") ? href : `https://wa.me/5585994482323?text=${encodeURIComponent("Olá! Gostaria de mais informações.")}`;

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
