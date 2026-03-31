"use client";

import { AnalyticsEventBridge } from "@/components/analytics/AnalyticsEventBridge";
import { CartProvider } from "@/context/CartContext";
import { LayoutConditional } from "./LayoutConditional";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnalyticsEventBridge />
      <LayoutConditional>{children}</LayoutConditional>
    </CartProvider>
  );
}
