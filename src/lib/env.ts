/**
 * Variáveis de ambiente públicas. Use em cliente e servidor.
 * Em produção, defina NEXT_PUBLIC_SITE_URL e NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
const DEFAULT_WHATSAPP = "5585994482323";

function getBaseUrlInternal(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://phoenixglobal.com.br";
  return url.replace(/\/$/, "");
}

function getWhatsAppNumberInternal(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits : DEFAULT_WHATSAPP.replace(/\D/g, "");
}

export function getBaseUrl(): string {
  return getBaseUrlInternal();
}

export function getWhatsAppNumber(): string {
  return getWhatsAppNumberInternal();
}

/** URL completa para abrir WhatsApp com mensagem pré-preenchida. Nunca retorna string vazia. */
export function getWhatsAppLink(message: string): string {
  const number = getWhatsAppNumberInternal();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/** Retorna a URL absoluta para um path (ex: /produtos/foo.png). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrlInternal()}${p}`;
}
