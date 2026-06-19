import type { Locale } from '@/i18n/types';

export type LocalizedText = { hy: string; en: string };

function parseJsonLocalizedString(value: string): LocalizedText | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null;
  try {
    const parsed = JSON.parse(trimmed) as Partial<LocalizedText>;
    const hy = String(parsed.hy ?? parsed.en ?? '').trim();
    const en = String(parsed.en ?? parsed.hy ?? '').trim();
    if (!hy && !en) return null;
    return { hy, en: en || hy };
  } catch {
    return null;
  }
}

export function parseLocalized(value: unknown): LocalizedText {
  if (typeof value === 'string') {
    const parsed = parseJsonLocalizedString(value);
    if (parsed) return parsed;
    const trimmed = value.trim();
    return { hy: trimmed, en: trimmed };
  }
  if (value && typeof value === 'object') {
    const o = value as Partial<LocalizedText>;
    const hy = String(o.hy ?? o.en ?? '').trim();
    const en = String(o.en ?? o.hy ?? '').trim();
    return { hy, en: en || hy };
  }
  return { hy: '', en: '' };
}

export function pickLocalized(value: unknown, locale: Locale = 'hy'): string {
  const obj = parseLocalized(value);
  if (locale === 'en') return obj.en || obj.hy;
  return obj.hy || obj.en;
}

export function emptyLocalized(): LocalizedText {
  return { hy: '', en: '' };
}
