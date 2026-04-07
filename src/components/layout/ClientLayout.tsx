"use client";

import { Suspense } from "react";
import { AnalyticsEventBridge } from "@/components/analytics/AnalyticsEventBridge";
import { AnalyticsPageViewTracker } from "@/components/analytics/AnalyticsPageViewTracker";
import { CartProvider } from "@/context/CartContext";
import { AtendenteFlutuante } from "@/components/atendente/AtendenteFlutuante";
import { LayoutConditional } from "./LayoutConditional";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnalyticsEventBridge />
      <Suspense fallback={null}>
        <AnalyticsPageViewTracker />
      </Suspense>
      <LayoutConditional>{children}</LayoutConditional>
      <AtendenteFlutuante />
    </CartProvider>
  );
}
