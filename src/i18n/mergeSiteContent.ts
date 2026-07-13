import type { Locale } from './types';
import { contentMatchesLocale } from './localeContent';
import { getSiteContentForLocale } from './siteContent';

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

const LEGACY_HERO_TITLES = [
  'Ոճ, որը ստեղծվում է',
  'Ոճ, որը ստեղծվում է արևից',
  'Style crafted',
];
const LEGACY_HERO_ACCENTS = ['ձեռքով', 'արևից', 'from the sun'];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function hasMojibake(value: unknown): boolean {
  if (value == null) return false;
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return MOJIBAKE_RE.test(text);
}

function isLegacyHeroText(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return LEGACY_HERO_TITLES.includes(trimmed) || LEGACY_HERO_ACCENTS.includes(trimmed);
}

/** Drop outdated hero slogans so API/DB copy cannot overwrite current brand text. */
function stripLegacyHero(partial: unknown, localeDefaults: Record<string, unknown>): unknown {
  if (!isPlainObject(partial)) return partial;

  const content = JSON.parse(JSON.stringify(partial)) as Record<string, unknown>;
  const home = content.home;
  if (!isPlainObject(home)) return content;

  const hero = home.hero;
  if (!isPlainObject(hero)) return content;

  const looksLegacy =
    isLegacyHeroText(hero.title) ||
    isLegacyHeroText(hero.titleAccent) ||
    isLegacyHeroText(hero.titleLine1) ||
    isLegacyHeroText(hero.titleGold1);

  if (!looksLegacy) return content;

  const defaultHome = localeDefaults.home;
  if (!isPlainObject(defaultHome) || !isPlainObject(defaultHome.hero)) return content;

  const defaults = defaultHome.hero;
  hero.title = defaults.title;
  hero.titleAccent = defaults.titleAccent;
  hero.titleLine1 = defaults.titleLine1;
  hero.titleGold1 = defaults.titleGold1;
  hero.conjunction = defaults.conjunction;
  hero.titleGold2 = defaults.titleGold2;

  return content;
}

/** Deep-merge partial saved JSON onto locale defaults (arrays from partial replace entirely). */
export function mergeSiteContentForLocale(locale: Locale, partial: unknown) {
  const base = JSON.parse(JSON.stringify(getSiteContentForLocale(locale))) as Record<string, unknown>;
  if (!isPlainObject(partial) || hasMojibake(partial) || !contentMatchesLocale(locale, partial)) {
    return base;
  }

  const cleaned = stripLegacyHero(partial, base);
  if (!isPlainObject(cleaned)) return base;

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

  merge(base, cleaned);
  return base;
}
