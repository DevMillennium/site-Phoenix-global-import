import { timingSafeEqual } from "node:crypto";

function readSecret(): string {
  return (
    process.env.PAIOS_CATALOG_SYNC_SECRET?.trim() ||
    process.env.PAIOS_WEBHOOK_SECRET?.trim() ||
    ""
  );
}

function tokensEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Valida Bearer ou X-PAIOS-Catalog-Secret (timing-safe). */
export function isPaiosInternalAuthorized(request: Request): boolean {
  const secret = readSecret();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization");
  const header =
    request.headers.get("x-paios-catalog-secret") ??
    request.headers.get("x-paios-webhook-secret");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const token = bearer ?? header?.trim() ?? "";

  return tokensEqual(token, secret);
}
