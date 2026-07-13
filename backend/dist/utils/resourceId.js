"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeResourceId = normalizeResourceId;
/** Decode and normalize resource ids from URL params (supports Armenian unicode). */
function normalizeResourceId(id) {
    const trimmed = String(id ?? "").trim();
    if (!trimmed)
        return "";
    try {
        return decodeURIComponent(trimmed).normalize("NFC");
    }
    catch {
        return trimmed.normalize("NFC");
    }
}
