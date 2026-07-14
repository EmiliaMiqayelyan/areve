import { DEFAULT_SITE_CONTENT } from "../defaultSiteContent";

const LEGACY_HERO_TITLES = [
  "Ոճ, որը ստեղծվում է",
  "Ոճ, որը ստեղծվում է արևից",
  "Style crafted",
];
const LEGACY_HERO_ACCENTS = ["ձեռքով", "արևից", "from the sun"];

const LEGACY_ABOUT_TITLES = [
  "Պատմություն, պատմված բիզերով",
  "A story told in beads",
  "History told in beads",
];

function isLegacyHeroText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return (
    LEGACY_HERO_TITLES.includes(trimmed) || LEGACY_HERO_ACCENTS.includes(trimmed)
  );
}

function isLegacyAboutBeginning(beginning: Record<string, unknown>): boolean {
  const title = typeof beginning.title === "string" ? beginning.title.trim() : "";
  if (LEGACY_ABOUT_TITLES.includes(title)) return true;
  if (/բիզերով|told in beads/i.test(title)) return true;

  const paragraphs = beginning.paragraphs;
  if (Array.isArray(paragraphs)) {
    const joined = paragraphs.map(String).join(" ");
    if (/փոքր սեղան|բիզերով աման|bowl of beads|near a window/i.test(joined)) {
      return true;
    }
  }
  return false;
}

/** Replace outdated copy saved in admin/site_content JSON. */
export function repairLegacyHeroContent(partial: unknown): unknown {
  if (!partial || typeof partial !== "object" || Array.isArray(partial)) {
    return partial;
  }

  const content = structuredClone(partial) as Record<string, unknown>;

  const home = content.home;
  if (home && typeof home === "object" && !Array.isArray(home)) {
    const hero = (home as Record<string, unknown>).hero;
    if (hero && typeof hero === "object" && !Array.isArray(hero)) {
      const h = hero as Record<string, unknown>;
      const defaults = DEFAULT_SITE_CONTENT.home.hero;
      const looksLegacy =
        isLegacyHeroText(h.title) ||
        isLegacyHeroText(h.titleAccent) ||
        isLegacyHeroText(h.titleLine1) ||
        isLegacyHeroText(h.titleGold1);

      if (looksLegacy) {
        h.title = defaults.title;
        h.titleAccent = defaults.titleAccent;
        h.titleLine1 = defaults.titleLine1;
        h.titleGold1 = defaults.titleGold1;
        h.conjunction = defaults.conjunction;
        h.titleGold2 = defaults.titleGold2;
      }
    }
  }

  const about = content.about;
  if (about && typeof about === "object" && !Array.isArray(about)) {
    const beginning = (about as Record<string, unknown>).beginning;
    if (beginning && typeof beginning === "object" && !Array.isArray(beginning)) {
      const b = beginning as Record<string, unknown>;
      if (isLegacyAboutBeginning(b)) {
        const defaults = DEFAULT_SITE_CONTENT.about.beginning;
        b.eyebrow = defaults.eyebrow;
        b.title = defaults.title;
        b.paragraphs = [...defaults.paragraphs];
        if (!b.image) b.image = defaults.image;
      }
    }
  }

  return content;
}
