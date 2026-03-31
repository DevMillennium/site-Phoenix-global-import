"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackEvent("page_view", {
      page_path: pagePath,
      page_location: typeof window !== "undefined" ? window.location.href : pagePath,
    });
  }, [pathname, searchParams]);

  return null;
}
