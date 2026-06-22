"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCIAL_URLS = void 0;
exports.isLegacyInstagramUrl = isLegacyInstagramUrl;
exports.isLegacyFacebookUrl = isLegacyFacebookUrl;
/** Official AREVÉ Collections social profile URLs */
exports.SOCIAL_URLS = {
    instagram: "https://www.instagram.com/areve_collections?igsh=MXRkNW9rdnZhaTd6cA%3D%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/18mdNprAXw/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@areve_collections?_r=1&_t=ZS-9791ZS0NSEu",
    youtube: "https://youtube.com/@areve_collections?si=XM4HvU8cfXMTbN5I",
};
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
function isLegacyInstagramUrl(url) {
    return LEGACY_INSTAGRAM.has(url.trim()) || url.includes("areve_brand");
}
function isLegacyFacebookUrl(url) {
    return LEGACY_FACEBOOK.has(url.trim()) || url.includes("areve.brand");
}
