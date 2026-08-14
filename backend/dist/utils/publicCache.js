"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedPublicSettings = getCachedPublicSettings;
exports.setCachedPublicSettings = setCachedPublicSettings;
exports.invalidatePublicSettingsCache = invalidatePublicSettingsCache;
const SETTINGS_TTL_MS = 60000;
let settingsCache = null;
function getCachedPublicSettings() {
    if (!settingsCache)
        return null;
    if (Date.now() > settingsCache.expiresAt) {
        settingsCache = null;
        return null;
    }
    return settingsCache.payload;
}
function setCachedPublicSettings(payload) {
    settingsCache = { payload, expiresAt: Date.now() + SETTINGS_TTL_MS };
}
function invalidatePublicSettingsCache() {
    settingsCache = null;
}
