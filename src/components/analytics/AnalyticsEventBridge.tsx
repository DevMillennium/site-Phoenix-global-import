"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

function parsePayload(payloadText: string | undefined) {
  if (!payloadText) return {};
  try {
    return JSON.parse(payloadText) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function AnalyticsEventBridge() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-track-event]");
      if (!element) return;

      const eventName = element.dataset.trackEvent;
      if (!eventName) return;

      const payload = parsePayload(element.dataset.trackPayload);
      trackEvent(eventName, payload);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
