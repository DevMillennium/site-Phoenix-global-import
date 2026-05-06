/**
 * Lê o corpo de uma fetch Response como JSON.
 * Quando o servidor devolve texto puro (ex.: "Internal Server Error") ou HTML, não lança SyntaxError.
 */
export async function tryParseResponseJson<T>(res: Response): Promise<
  { parsed: true; data: T } | { parsed: false }
> {
  const text = await res.text();
  const t = text.trim();
  if (!t) {
    return { parsed: true, data: {} as T };
  }
  try {
    return { parsed: true, data: JSON.parse(t) as T };
  } catch {
    return { parsed: false };
  }
}
