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
function isLegacyHeroText(value) {
    if (typeof value !== "string")
        return false;
    const trimmed = value.trim();
    return (LEGACY_HERO_TITLES.includes(trimmed) || LEGACY_HERO_ACCENTS.includes(trimmed));
}
/** Replace outdated hero slogans saved in admin/site_content JSON. */
function repairLegacyHeroContent(partial) {
    if (!partial || typeof partial !== "object" || Array.isArray(partial)) {
        return partial;
    }
    const content = structuredClone(partial);
    const home = content.home;
    if (!home || typeof home !== "object" || Array.isArray(home))
        return content;
    const hero = home.hero;
    if (!hero || typeof hero !== "object" || Array.isArray(hero))
        return content;
    const h = hero;
    const defaults = defaultSiteContent_1.DEFAULT_SITE_CONTENT.home.hero;
    const looksLegacy = isLegacyHeroText(h.title) ||
        isLegacyHeroText(h.titleAccent) ||
        isLegacyHeroText(h.titleLine1) ||
        isLegacyHeroText(h.titleGold1);
    if (!looksLegacy)
        return content;
    h.title = defaults.title;
    h.titleAccent = defaults.titleAccent;
    h.titleLine1 = defaults.titleLine1;
    h.titleGold1 = defaults.titleGold1;
    h.conjunction = defaults.conjunction;
    h.titleGold2 = defaults.titleGold2;
    return content;
}
