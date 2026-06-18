"use client";

import { getWhatsAppLink } from "@/lib/env";
import { trackEvent } from "@/lib/analytics";
import { registerSiteLead, type RegisterLeadContext } from "@/lib/register-lead";

interface LinkWhatsAppProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  trackingSource?: string;
  trackingAction?: string;
  /** Registra lead no PAIOS antes de abrir WhatsApp (fire-and-forget). */
  leadContext?: RegisterLeadContext;
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
  leadContext,
}: LinkWhatsAppProps) {
  const openWhatsApp = (e: React.MouseEvent) => {
    const link = href && href.startsWith("https://wa.me/") ? href : getWhatsAppLink(FALLBACK_MESSAGE);
    if (!link.startsWith("https://wa.me/")) return;
    trackEvent("whatsapp_click", {
      source: trackingSource,
      action: trackingAction,
    });
    if (leadContext) {
      registerSiteLead(leadContext);
    }
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
