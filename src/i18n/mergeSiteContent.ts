import type { Locale } from './types';
import { contentMatchesLocale } from './localeContent';
import { getSiteContentForLocale } from './siteContent';

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function hasMojibake(value: unknown): boolean {
  if (value == null) return false;
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return MOJIBAKE_RE.test(text);
}

/** Deep-merge partial saved JSON onto locale defaults (arrays from partial replace entirely). */
export function mergeSiteContentForLocale(locale: Locale, partial: unknown) {
  const base = JSON.parse(JSON.stringify(getSiteContentForLocale(locale))) as Record<string, unknown>;
  if (!isPlainObject(partial) || hasMojibake(partial) || !contentMatchesLocale(locale, partial)) {
    return base;
  }

  function merge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const key of Object.keys(source)) {
      const sv = source[key];
      const tv = target[key];
      if (Array.isArray(sv)) {
        target[key] = sv;
      } else if (isPlainObject(sv) && isPlainObject(tv)) {
        merge(tv, sv);
      } else if (sv !== undefined) {
        target[key] = sv;
      }
    }
  }

  merge(base, partial);
  return base;
}
