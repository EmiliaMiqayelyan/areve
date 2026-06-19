"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairCorruptedSettings = repairCorruptedSettings;
const models_1 = require("../models");
const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;
const ARMENIAN_TAGLINE = "Ձեռագործ · Եզակի · Սիրով ստեղծված";
const ARMENIAN_FOOTER = "Յուրաքանչյուր կտոր փոքրիկ արև է — ստեղծված ջերմությամբ, համբերությամբ և միայն ձեռքերով տրվող սիրով։";
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
/** Reset settings text that was saved with broken UTF-8 or legacy English defaults. */
async function repairCorruptedSettings() {
    const row = await models_1.Setting.findByPk(1);
    if (!row)
        return;
    const j = row.toJSON();
    const tagline = String(j.tagline ?? "");
    const footer = String(j.footerDescription ?? j.footer_description ?? "");
    const siteContent = j.siteContent ?? j.site_content;
    const corrupted = hasMojibake(tagline) ||
        hasMojibake(footer) ||
        hasMojibake(siteContent) ||
        isLegacyEnglishCopy(tagline, footer);
    if (!corrupted)
        return;
    await row.update({
        tagline: ARMENIAN_TAGLINE,
        footerDescription: ARMENIAN_FOOTER,
        siteContent: null,
    });
    console.log("repairCorruptedSettings: restored Armenian settings copy");
}
