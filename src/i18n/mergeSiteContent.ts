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

function stripReviewsLinks(links: unknown): unknown {
  if (!Array.isArray(links)) return links;
  return links.filter((item) => {
    if (Array.isArray(item)) return item[0] !== '/reviews';
    if (isPlainObject(item)) return item.href !== '/reviews';
    return true;
  });
}

/** Force current brand copy for surfaces that must not keep stale DB values. */
function applyCanonicalStorefrontCopy(
  content: Record<string, unknown>,
  localeDefaults: Record<string, unknown>
) {
  if (Array.isArray(localeDefaults.nav)) {
    content.nav = JSON.parse(JSON.stringify(localeDefaults.nav));
  }

  if (isPlainObject(localeDefaults.about) && isPlainObject(localeDefaults.about.beginning)) {
    if (!isPlainObject(content.about)) content.about = {};
    (content.about as Record<string, unknown>).beginning = JSON.parse(
      JSON.stringify(localeDefaults.about.beginning)
    );
  }

  if (
    isPlainObject(localeDefaults.home) &&
    isPlainObject(localeDefaults.home.hero) &&
    isPlainObject(content.home)
  ) {
    const defaults = localeDefaults.home.hero;
    if (!isPlainObject((content.home as Record<string, unknown>).hero)) {
      (content.home as Record<string, unknown>).hero = {};
    }
    const hero = (content.home as Record<string, unknown>).hero as Record<string, unknown>;
    hero.title = defaults.title;
    hero.titleAccent = defaults.titleAccent;
    hero.titleLine1 = defaults.titleLine1;
    hero.titleGold1 = defaults.titleGold1;
    hero.conjunction = defaults.conjunction;
    hero.titleGold2 = defaults.titleGold2;
  }

  if (isPlainObject(content.footer)) {
    content.footer.explore = stripReviewsLinks(content.footer.explore);
    content.footer.support = stripReviewsLinks(content.footer.support);
  }
}

/** Deep-merge partial saved JSON onto locale defaults (arrays from partial replace entirely). */
export function mergeSiteContentForLocale(locale: Locale, partial: unknown) {
  const base = JSON.parse(JSON.stringify(getSiteContentForLocale(locale))) as Record<string, unknown>;
  if (!isPlainObject(partial) || hasMojibake(partial) || !contentMatchesLocale(locale, partial)) {
    applyCanonicalStorefrontCopy(base, base);
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
  applyCanonicalStorefrontCopy(base, JSON.parse(JSON.stringify(getSiteContentForLocale(locale))));
  return base;
}
