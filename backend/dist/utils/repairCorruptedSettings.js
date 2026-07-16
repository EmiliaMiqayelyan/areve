"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairCorruptedSettings = repairCorruptedSettings;
const models_1 = require("../models");
const defaultSiteContent_1 = require("../defaultSiteContent");
const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;
const ARMENIAN_TAGLINE = "Արև՝ քո առօրյայում";
const ARMENIAN_FOOTER = "Յուրաքանչյուրը փոքրիկ արև է";
function hasMojibake(value) {
    if (value == null)
        return false;
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return MOJIBAKE_RE.test(text);
}
function isLegacyEnglishCopy(tagline, footer) {
    return (/Handcrafted/i.test(tagline) ||
        /Every piece is a tiny sun/i.test(footer) ||
        tagline.trim() === "" ||
        footer.trim() === "");
}
function isLegacyArmenianFooter(footer) {
    const trimmed = footer.trim();
    if (trimmed === ARMENIAN_FOOTER)
        return false;
    return (trimmed.startsWith("Ստեղծված ձեռքերով") ||
        trimmed.startsWith("Յուրաքանչյուր կտոր փոքրիկ արև է"));
}
function siteContentLooksStale(siteContent) {
    if (siteContent == null)
        return false;
    const text = JSON.stringify(siteContent);
    return (text.includes("Պատրաստ եք գտնել ձեր կտորը") ||
        text.includes("Պատմություն, պատմված բիզերով") ||
        text.includes("Ոճ, որը ստեղծվում է") ||
        text.includes("/reviews") ||
        text.includes("Կարծիքներ") ||
        text.includes("ՏԵՍԱԿԱՆԻ"));
}
/** Reset settings text that was saved with broken UTF-8 or legacy defaults. */
async function repairCorruptedSettings() {
    const row = await models_1.Setting.findByPk(1);
    if (!row)
        return;
    const j = row.toJSON();
    const tagline = String(j.tagline ?? "");
    const footer = String(j.footerDescription ?? j.footer_description ?? "");
    const siteContent = j.siteContent ?? j.site_content;
    const patch = {};
    const corrupted = hasMojibake(tagline) ||
        hasMojibake(footer) ||
        hasMojibake(siteContent) ||
        isLegacyEnglishCopy(tagline, footer);
    if (corrupted) {
        patch.tagline = ARMENIAN_TAGLINE;
        patch.footerDescription = ARMENIAN_FOOTER;
        patch.siteContent = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT);
    }
    else if (isLegacyArmenianFooter(footer)) {
        patch.footerDescription = ARMENIAN_FOOTER;
    }
    // Replace stale storefront JSON so DB matches code (API also ignores DB copy).
    if (siteContentLooksStale(siteContent)) {
        patch.siteContent = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT);
    }
    if (Object.keys(patch).length === 0)
        return;
    await row.update(patch);
    console.log("repairCorruptedSettings: updated settings copy");
}
