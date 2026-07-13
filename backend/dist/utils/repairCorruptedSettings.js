"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairCorruptedSettings = repairCorruptedSettings;
const models_1 = require("../models");
const mergeSiteContent_1 = require("./mergeSiteContent");
const repairLegacyHeroContent_1 = require("./repairLegacyHeroContent");
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
        patch.siteContent = null;
    }
    else if (isLegacyArmenianFooter(footer)) {
        patch.footerDescription = ARMENIAN_FOOTER;
    }
    if (!corrupted && siteContent != null) {
        const repaired = (0, repairLegacyHeroContent_1.repairLegacyHeroContent)(siteContent);
        if (JSON.stringify(repaired) !== JSON.stringify(siteContent)) {
            patch.siteContent = (0, mergeSiteContent_1.mergeSiteContent)(repaired);
        }
    }
    if (Object.keys(patch).length === 0)
        return;
    await row.update(patch);
    console.log("repairCorruptedSettings: updated settings copy");
}
