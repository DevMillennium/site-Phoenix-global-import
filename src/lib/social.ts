/**
 * Redes sociais oficiais — alinhado ao Instagram @globalholdingphoenix
 * (nome exibido: Phoenix Imports · mesmo WhatsApp do site)
 */

const DEFAULT_INSTAGRAM = "https://www.instagram.com/globalholdingphoenix";
const DEFAULT_INSTAGRAM_HANDLE = "globalholdingphoenix";
const DEFAULT_FACEBOOK = "https://www.facebook.com/phoenixglobalimport";

export function getInstagramUrl(): string {
  return (process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? DEFAULT_INSTAGRAM).replace(/\/$/, "");
}

export function getInstagramHandle(): string {
  return process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? DEFAULT_INSTAGRAM_HANDLE;
}

/** Abre conversa no Instagram Direct (web/app). */
export function getInstagramDirectUrl(): string {
  return `https://www.instagram.com/direct/t/${getInstagramHandle()}`;
}

export function getFacebookUrl(): string {
  return (process.env.NEXT_PUBLIC_FACEBOOK_URL ?? DEFAULT_FACEBOOK).replace(/\/$/, "");
}

/** Perfis para JSON-LD sameAs e SEO. */
export function getSocialSameAs(): string[] {
  return [getInstagramUrl(), getFacebookUrl()].filter(Boolean);
}

export const instagramProfile = {
  handle: DEFAULT_INSTAGRAM_HANDLE,
  displayName: "Phoenix Imports",
  tagline: "Holding Internacional · Importações Brasil ↔ Paraguai",
  topics: ["Tecnologia", "IA", "Expansão empresarial"],
  postsCount: 29,
} as const;
