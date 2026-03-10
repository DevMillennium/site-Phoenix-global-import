import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emulador Mobile",
  description: "Visualize o site Phoenix Global Import em viewport mobile.",
  robots: "noindex, nofollow",
};

export default function EmuladorMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
