"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalizedObject = isLocalizedObject;
exports.normalizeLocalizedInput = normalizeLocalizedInput;
exports.pickLocalized = pickLocalized;
exports.parseLocalized = parseLocalized;
exports.needsLocalizedMigration = needsLocalizedMigration;
function isLocalizedObject(value) {
    return typeof value === "object" && value !== null && ("hy" in value || "en" in value);
}
function parseJsonLocalizedString(value) {
    const trimmed = value.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}"))
        return null;
    try {
        const parsed = JSON.parse(trimmed);
        if (!isLocalizedObject(parsed))
            return null;
        const hy = String(parsed.hy ?? parsed.en ?? "").trim();
        const en = String(parsed.en ?? parsed.hy ?? "").trim();
        if (!hy && !en)
            return null;
        return { hy, en: en || hy };
    }
    catch {
        return null;
    }
}
function normalizeLocalizedInput(value) {
    if (typeof value === "string") {
        const parsed = parseJsonLocalizedString(value);
        if (parsed)
            return parsed;
        const trimmed = value.trim();
        return { hy: trimmed, en: trimmed };
    }
    if (isLocalizedObject(value)) {
        const hy = String(value.hy ?? value.en ?? "").trim();
        const en = String(value.en ?? value.hy ?? "").trim();
        return { hy, en: en || hy };
    }
    return { hy: "", en: "" };
}
function pickLocalized(value, locale = "hy") {
    if (value == null)
        return "";
    const obj = normalizeLocalizedInput(value);
    if (locale === "en")
        return obj.en || obj.hy;
    return obj.hy || obj.en;
}
function parseLocalized(value) {
    return normalizeLocalizedInput(value);
}
function needsLocalizedMigration(value) {
    return typeof value === "string";
}
