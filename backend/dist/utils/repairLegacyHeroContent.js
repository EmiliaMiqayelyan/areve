"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairLegacyHeroContent = repairLegacyHeroContent;
const defaultSiteContent_1 = require("../defaultSiteContent");
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
function isLegacyHeroText(value) {
    if (typeof value !== "string")
        return false;
    const trimmed = value.trim();
    return (LEGACY_HERO_TITLES.includes(trimmed) || LEGACY_HERO_ACCENTS.includes(trimmed));
}
function isLegacyAboutBeginning(beginning) {
    const title = typeof beginning.title === "string" ? beginning.title.trim() : "";
    if (LEGACY_ABOUT_TITLES.includes(title))
        return true;
    if (/բիզերով|told in beads/i.test(title))
        return true;
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
function repairLegacyHeroContent(partial) {
    if (!partial || typeof partial !== "object" || Array.isArray(partial)) {
        return partial;
    }
    const content = structuredClone(partial);
    const home = content.home;
    if (home && typeof home === "object" && !Array.isArray(home)) {
        const hero = home.hero;
        if (hero && typeof hero === "object" && !Array.isArray(hero)) {
            const h = hero;
            const defaults = defaultSiteContent_1.DEFAULT_SITE_CONTENT.home.hero;
            const looksLegacy = isLegacyHeroText(h.title) ||
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
        const beginning = about.beginning;
        if (beginning && typeof beginning === "object" && !Array.isArray(beginning)) {
            const b = beginning;
            if (isLegacyAboutBeginning(b)) {
                const defaults = defaultSiteContent_1.DEFAULT_SITE_CONTENT.about.beginning;
                b.eyebrow = defaults.eyebrow;
                b.title = defaults.title;
                b.paragraphs = [...defaults.paragraphs];
                if (!b.image)
                    b.image = defaults.image;
            }
        }
    }
    return content;
}
