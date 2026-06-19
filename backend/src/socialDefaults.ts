/** Official AREVÉ Collections social profile URLs */
export const SOCIAL_URLS = {
  instagram:
    "https://www.instagram.com/areve_collections?igsh=MXRkNW9rdnZhaTd6cA%3D%3D&utm_source=qr",
  facebook: "https://www.facebook.com/share/18mdNprAXw/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@areve_collections?_r=1&_t=ZS-9791ZS0NSEu",
  youtube: "https://youtube.com/@areve_collections?si=XM4HvU8cfXMTbN5I",
} as const;

const LEGACY_INSTAGRAM = new Set([
  "https://instagram.com/areve_brand",
  "https://www.instagram.com/areve_brand",
  "https://instagram.com",
  "https://www.instagram.com",
]);

const LEGACY_FACEBOOK = new Set([
  "https://facebook.com/areve.brand",
  "https://www.facebook.com/areve.brand",
  "https://facebook.com",
  "https://www.facebook.com",
]);

export function isLegacyInstagramUrl(url: string): boolean {
  return LEGACY_INSTAGRAM.has(url.trim()) || url.includes("areve_brand");
}

export function isLegacyFacebookUrl(url: string): boolean {
  return LEGACY_FACEBOOK.has(url.trim()) || url.includes("areve.brand");
}
