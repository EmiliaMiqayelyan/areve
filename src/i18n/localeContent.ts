import type { Locale } from './types';

export function hasArmenianScript(value?: string | null): boolean {
  return Boolean(value && /[\u0530-\u058F]/.test(value));
}

/** True when saved CMS JSON matches the active UI locale. */
export function contentMatchesLocale(locale: Locale, partial: unknown): boolean {
  if (partial == null) return false;
  const text = typeof partial === 'string' ? partial : JSON.stringify(partial);
  const armenian = hasArmenianScript(text);
  return locale === 'hy' ? armenian : !armenian;
}
