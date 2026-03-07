/**
 * Variáveis de ambiente públicas. Use em cliente e servidor.
 * Em produção, defina NEXT_PUBLIC_SITE_URL e NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5585994482323";

export function getBaseUrl(): string {
  return BASE_URL.replace(/\/$/, "");
}

export function getWhatsAppNumber(): string {
  return WHATSAPP_NUMBER.replace(/\D/g, "");
}

/** Retorna a URL absoluta para um path (ex: /produtos/foo.png). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${p}`;
}
