import type { Locale } from '../types';
import { SITE_CONTENT_EN } from './en';
import { SITE_CONTENT_HY } from './hy';

export function getSiteContentForLocale(locale: Locale) {
  return locale === 'en' ? SITE_CONTENT_EN : SITE_CONTENT_HY;
}

export { SITE_CONTENT_HY, SITE_CONTENT_EN };
