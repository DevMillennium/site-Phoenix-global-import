"use client";

import { getInstagramDirectUrl, getInstagramHandle } from "@/lib/social";
import { trackEvent } from "@/lib/analytics";
import { registerSiteLead } from "@/lib/register-lead";
import type { RegisterLeadContext } from "@/lib/register-lead";

interface LinkInstagramProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  trackingSource?: string;
  trackingAction?: string;
  leadContext?: RegisterLeadContext;
}

/** Abre Instagram Direct com @globalholdingphoenix (Phoenix Imports). */
export function LinkInstagram({
  children,
  className,
  ariaLabel,
  trackingSource = "unknown",
  trackingAction = "open_instagram",
  leadContext,
}: LinkInstagramProps) {
  const href = getInstagramDirectUrl();
  const handle = getInstagramHandle();

  const openInstagram = (e: React.MouseEvent) => {
    trackEvent("instagram_click", {
      source: trackingSource,
      action: trackingAction,
      handle,
    });
    if (leadContext) {
      registerSiteLead({ ...leadContext, channelPreference: "instagram" });
    }
    e.preventDefault();
    const w = typeof window !== "undefined" ? window.top ?? window : null;
    if (w) w.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={href}
      onClick={openInstagram}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel ?? `Chamar @${handle} no Instagram`}
    >
      {children}
    </a>
  );
}
