import { DEFAULT_SITE_CONTENT, SiteContent } from "../defaultSiteContent";
import { repairLegacyHeroContent } from "./repairLegacyHeroContent";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge partial saved JSON onto defaults (arrays from partial replace entirely). */
export function mergeSiteContent(partial: unknown): SiteContent {
  const base = structuredClone(DEFAULT_SITE_CONTENT) as unknown as Record<string, unknown>;
  const cleaned = repairLegacyHeroContent(partial);
  if (!isPlainObject(cleaned)) return base as unknown as SiteContent;

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
  return base as unknown as SiteContent;
}
