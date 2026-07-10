/** Decode and normalize resource ids from URL params (supports Armenian unicode). */
export function normalizeResourceId(id: string): string {
  const trimmed = String(id ?? "").trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed).normalize("NFC");
  } catch {
    return trimmed.normalize("NFC");
  }
}
