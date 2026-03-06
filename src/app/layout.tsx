import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

export const metadata: Metadata = {
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
