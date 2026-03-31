"use client";

import { getWhatsAppLink } from "@/lib/env";
import { trackEvent } from "@/lib/analytics";

interface LinkWhatsAppProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  trackingSource?: string;
  trackingAction?: string;
}

const FALLBACK_MESSAGE = "Olá! Gostaria de mais informações.";

/** Abre o link do WhatsApp (funciona dentro de iframe, ex.: emulador mobile). */
export function LinkWhatsApp({
  href,
  children,
  className,
  ariaLabel,
  trackingSource = "unknown",
  trackingAction = "open_whatsapp",
}: LinkWhatsAppProps) {
  const openWhatsApp = (e: React.MouseEvent) => {
    const link = href && href.startsWith("https://wa.me/") ? href : getWhatsAppLink(FALLBACK_MESSAGE);
    if (!link.startsWith("https://wa.me/")) return;
    trackEvent("whatsapp_click", {
      source: trackingSource,
      action: trackingAction,
    });
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
