import type { Locale } from './types';
import { getSiteContentForLocale } from './siteContent';

/**
 * Public storefront copy always comes from locale code defaults.
 * API/DB `site_content` is ignored so edits in `src/i18n/siteContent/*` win after deploy.
 */
export function mergeSiteContentForLocale(locale: Locale, _partial?: unknown) {
  return JSON.parse(JSON.stringify(getSiteContentForLocale(locale)));
}
