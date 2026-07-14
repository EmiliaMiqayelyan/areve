import { DEFAULT_SITE_CONTENT, SiteContent } from "../defaultSiteContent";
import { repairLegacyHeroContent } from "./repairLegacyHeroContent";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function stripReviewsLinks(links: unknown): unknown {
  if (!Array.isArray(links)) return links;
  return links.filter((item) => {
    if (Array.isArray(item)) return item[0] !== "/reviews";
    if (isPlainObject(item)) return item.href !== "/reviews";
    return true;
  });
}

/**
 * Make branded surfaces win over stale admin/DB JSON:
 * - nav without Reviews
 * - about.beginning from current defaults
 * - home.hero legacy slogans already repaired upstream
 */
export function applyCanonicalStorefrontCopy(content: Record<string, unknown>): void {
  content.nav = structuredClone(DEFAULT_SITE_CONTENT.nav);

  const about = content.about;
  if (isPlainObject(about)) {
    about.beginning = structuredClone(DEFAULT_SITE_CONTENT.about.beginning);
  }

  const home = content.home;
  if (isPlainObject(home) && isPlainObject(home.hero)) {
    const defaults = DEFAULT_SITE_CONTENT.home.hero;
    const hero = home.hero;
    hero.title = defaults.title;
    hero.titleAccent = defaults.titleAccent;
    hero.titleLine1 = defaults.titleLine1;
    hero.titleGold1 = defaults.titleGold1;
    hero.conjunction = defaults.conjunction;
    hero.titleGold2 = defaults.titleGold2;
  }

  const footer = content.footer;
  if (isPlainObject(footer)) {
    footer.explore = stripReviewsLinks(footer.explore);
    footer.support = stripReviewsLinks(footer.support);
  }
}

/** Deep-merge partial saved JSON onto defaults (arrays from partial replace entirely). */
export function mergeSiteContent(partial: unknown): SiteContent {
  const base = structuredClone(DEFAULT_SITE_CONTENT) as unknown as Record<string, unknown>;
  const cleaned = repairLegacyHeroContent(partial);
  if (!isPlainObject(cleaned)) {
    applyCanonicalStorefrontCopy(base);
    return base as unknown as SiteContent;
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

  merge(base, cleaned);
  applyCanonicalStorefrontCopy(base);
  return base as unknown as SiteContent;
}
