const SETTINGS_TTL_MS = 60_000;

let settingsCache: { payload: unknown; expiresAt: number } | null = null;

export function getCachedPublicSettings(): unknown | null {
  if (!settingsCache) return null;
  if (Date.now() > settingsCache.expiresAt) {
    settingsCache = null;
    return null;
  }
  return settingsCache.payload;
}

export function setCachedPublicSettings(payload: unknown) {
  settingsCache = { payload, expiresAt: Date.now() + SETTINGS_TTL_MS };
}

export function invalidatePublicSettingsCache() {
  settingsCache = null;
}
