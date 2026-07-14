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

const LEGACY_ABOUT_TITLES = [
  'Պատմություն, պատմված բիզերով',
  'A story told in beads',
  'History told in beads',
];

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

function isLegacyAboutBeginning(beginning: Record<string, unknown>): boolean {
  const title = typeof beginning.title === 'string' ? beginning.title.trim() : '';
  if (LEGACY_ABOUT_TITLES.includes(title)) return true;
  if (/բիզերով|told in beads/i.test(title)) return true;

  const paragraphs = beginning.paragraphs;
  if (Array.isArray(paragraphs)) {
    const joined = paragraphs.map(String).join(' ');
    if (/փոքր սեղան|բիզերով աման|bowl of beads|near a window/i.test(joined)) {
      return true;
    }
  }
  return false;
}

/** Drop outdated site copy so API/DB values cannot overwrite current brand text. */
function stripLegacySiteContent(partial: unknown, localeDefaults: Record<string, unknown>): unknown {
  if (!isPlainObject(partial)) return partial;

  const content = JSON.parse(JSON.stringify(partial)) as Record<string, unknown>;

  const home = content.home;
  if (isPlainObject(home) && isPlainObject(home.hero)) {
    const hero = home.hero;
    const looksLegacy =
      isLegacyHeroText(hero.title) ||
      isLegacyHeroText(hero.titleAccent) ||
      isLegacyHeroText(hero.titleLine1) ||
      isLegacyHeroText(hero.titleGold1);

    if (looksLegacy) {
      const defaultHome = localeDefaults.home;
      if (isPlainObject(defaultHome) && isPlainObject(defaultHome.hero)) {
        const defaults = defaultHome.hero;
        hero.title = defaults.title;
        hero.titleAccent = defaults.titleAccent;
        hero.titleLine1 = defaults.titleLine1;
        hero.titleGold1 = defaults.titleGold1;
        hero.conjunction = defaults.conjunction;
        hero.titleGold2 = defaults.titleGold2;
      }
    }
  }

  const about = content.about;
  if (isPlainObject(about) && isPlainObject(about.beginning) && isLegacyAboutBeginning(about.beginning)) {
    const defaultAbout = localeDefaults.about;
    if (isPlainObject(defaultAbout) && isPlainObject(defaultAbout.beginning)) {
      const defaults = defaultAbout.beginning;
      about.beginning.eyebrow = defaults.eyebrow;
      about.beginning.title = defaults.title;
      about.beginning.paragraphs = Array.isArray(defaults.paragraphs)
        ? [...defaults.paragraphs]
        : about.beginning.paragraphs;
      if (!about.beginning.image && defaults.image) {
        about.beginning.image = defaults.image;
      }
    }
  }

  return content;
}

/** Deep-merge partial saved JSON onto locale defaults (arrays from partial replace entirely). */
export function mergeSiteContentForLocale(locale: Locale, partial: unknown) {
  const base = JSON.parse(JSON.stringify(getSiteContentForLocale(locale))) as Record<string, unknown>;
  if (!isPlainObject(partial) || hasMojibake(partial) || !contentMatchesLocale(locale, partial)) {
    return base;
  }

  const cleaned = stripLegacySiteContent(partial, base);
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
