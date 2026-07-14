import { DEFAULT_SITE_CONTENT, SiteContent } from "../defaultSiteContent";

/**
 * Public storefront copy always comes from code defaults.
 * Stale admin/DB `site_content` JSON is ignored so deploys reflect source changes.
 */
export function mergeSiteContent(_partial?: unknown): SiteContent {
  return structuredClone(DEFAULT_SITE_CONTENT);
}
