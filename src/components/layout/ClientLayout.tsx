"use client";

import { AnalyticsEventBridge } from "@/components/analytics/AnalyticsEventBridge";
import { AnalyticsPageViewTracker } from "@/components/analytics/AnalyticsPageViewTracker";
import { CartProvider } from "@/context/CartContext";
import { LayoutConditional } from "./LayoutConditional";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnalyticsEventBridge />
      <AnalyticsPageViewTracker />
      <LayoutConditional>{children}</LayoutConditional>
    </CartProvider>
  );
}
