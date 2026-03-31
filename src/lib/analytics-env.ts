function readPublicEnv(key: string): string | null {
  const value = process.env[key];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getGtmId(): string | null {
  return readPublicEnv("NEXT_PUBLIC_GTM_ID");
}

export function getGaMeasurementId(): string | null {
  return readPublicEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID");
}
