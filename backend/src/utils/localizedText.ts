export type LocalizedText = { hy: string; en: string };

export type Locale = "hy" | "en";

export function isLocalizedObject(value: unknown): value is Partial<LocalizedText> {
  return typeof value === "object" && value !== null && ("hy" in value || "en" in value);
}

function parseJsonLocalizedString(value: string): LocalizedText | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!isLocalizedObject(parsed)) return null;
    const hy = String(parsed.hy ?? parsed.en ?? "").trim();
    const en = String(parsed.en ?? parsed.hy ?? "").trim();
    if (!hy && !en) return null;
    return { hy, en: en || hy };
  } catch {
    return null;
  }
}

export function normalizeLocalizedInput(value: unknown): LocalizedText {
  if (typeof value === "string") {
    const parsed = parseJsonLocalizedString(value);
    if (parsed) return parsed;
    const trimmed = value.trim();
    return { hy: trimmed, en: trimmed };
  }
  if (isLocalizedObject(value)) {
    const hy = String(value.hy ?? value.en ?? "").trim();
    const en = String(value.en ?? value.hy ?? "").trim();
    return { hy, en: en || hy };
  }
  return { hy: "", en: "" };
}

export function pickLocalized(value: unknown, locale: Locale = "hy"): string {
  if (value == null) return "";
  const obj = normalizeLocalizedInput(value);
  if (locale === "en") return obj.en || obj.hy;
  return obj.hy || obj.en;
}

export function parseLocalized(value: unknown): LocalizedText {
  return normalizeLocalizedInput(value);
}

export function needsLocalizedMigration(value: unknown): boolean {
  return typeof value === "string";
}
