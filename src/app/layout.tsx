import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { LayoutConditional } from "@/components/layout/LayoutConditional";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phoenix Global Import | Eletrônicos e Tecnologia — Fortaleza",
    template: "%s | Phoenix Global Import",
  },
  description:
    "Eletrônicos e tecnologia importados. Estoque em Fortaleza, Ceará. Enviamos para todo o Brasil. AirPods, câmeras, gaming, wearables e mais. Pronta entrega.",
  keywords: [
    "importados",
    "eletrônicos",
    "Fortaleza",
    "AirPods",
    "câmeras",
    "tecnologia",
    "Phoenix Global Import",
  ],
  authors: [{ name: "Phoenix Global Import" }],
  icons: {
    icon: "/logo-phoenix-global.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Phoenix Global Import",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <LayoutConditional>{children}</LayoutConditional>
      </body>
    </html>
  );
}
