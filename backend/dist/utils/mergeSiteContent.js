"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCanonicalStorefrontCopy = applyCanonicalStorefrontCopy;
exports.mergeSiteContent = mergeSiteContent;
const defaultSiteContent_1 = require("../defaultSiteContent");
const repairLegacyHeroContent_1 = require("./repairLegacyHeroContent");
function isPlainObject(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function stripReviewsLinks(links) {
    if (!Array.isArray(links))
        return links;
    return links.filter((item) => {
        if (Array.isArray(item))
            return item[0] !== "/reviews";
        if (isPlainObject(item))
            return item.href !== "/reviews";
        return true;
    });
}
/**
 * Make branded surfaces win over stale admin/DB JSON:
 * - nav without Reviews
 * - about.beginning from current defaults
 * - home.hero legacy slogans already repaired upstream
 */
function applyCanonicalStorefrontCopy(content) {
    content.nav = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT.nav);
    const about = content.about;
    if (isPlainObject(about)) {
        about.beginning = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT.about.beginning);
    }
    const home = content.home;
    if (isPlainObject(home) && isPlainObject(home.hero)) {
        const defaults = defaultSiteContent_1.DEFAULT_SITE_CONTENT.home.hero;
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
function mergeSiteContent(partial) {
    const base = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT);
    const cleaned = (0, repairLegacyHeroContent_1.repairLegacyHeroContent)(partial);
    if (!isPlainObject(cleaned)) {
        applyCanonicalStorefrontCopy(base);
        return base;
    }
    function merge(target, source) {
        for (const key of Object.keys(source)) {
            const sv = source[key];
            const tv = target[key];
            if (Array.isArray(sv)) {
                target[key] = sv;
            }
            else if (isPlainObject(sv) && isPlainObject(tv)) {
                merge(tv, sv);
            }
            else if (sv !== undefined) {
                target[key] = sv;
            }
        }
    }
    merge(base, cleaned);
    applyCanonicalStorefrontCopy(base);
    return base;
}
