"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSiteContent = mergeSiteContent;
const defaultSiteContent_1 = require("../defaultSiteContent");
function isPlainObject(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
/** Deep-merge partial saved JSON onto defaults (arrays from partial replace entirely). */
function mergeSiteContent(partial) {
    const base = structuredClone(defaultSiteContent_1.DEFAULT_SITE_CONTENT);
    if (!isPlainObject(partial))
        return base;
    function merge(target, source) {
        for (const key of Object.keys(source)) {
            const sv = source[key];
            const tv = target[key];
            if (Array.isArray(sv)) {
                target[key] = sv;
            }
            else if (isPlainObject(sv) && isPlainObject(tv)) {
                merge(tv, sv);
            }
            else if (sv !== undefined) {
                target[key] = sv;
            }
        }
    }
    merge(base, partial);
    return base;
}
