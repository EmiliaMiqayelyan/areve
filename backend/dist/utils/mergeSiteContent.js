"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSiteContent = mergeSiteContent;
const defaultSiteContent_1 = require("../defaultSiteContent");
/**
 * Public storefront copy always comes from code defaults.
 * Stale admin/DB `site_content` JSON is ignored so deploys reflect source changes.
 */
function mergeSiteContent(_partial) {
    return structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT);
}
