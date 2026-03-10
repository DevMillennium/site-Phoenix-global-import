"use client";

import { CartProvider } from "@/context/CartContext";
import { LayoutConditional } from "./LayoutConditional";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutConditional>{children}</LayoutConditional>
    </CartProvider>
  );
}
