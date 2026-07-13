"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GALLERY_DIR = exports.UPLOAD_ROOT = void 0;
exports.persistDataUrlImage = persistDataUrlImage;
exports.isDataUrlImage = isDataUrlImage;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const UPLOAD_ROOT = path_1.default.resolve(__dirname, "../../uploads");
exports.UPLOAD_ROOT = UPLOAD_ROOT;
const GALLERY_DIR = path_1.default.join(UPLOAD_ROOT, "gallery");
exports.GALLERY_DIR = GALLERY_DIR;
const DATA_URL_RE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/;
function extensionForMime(mime) {
    const map = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg",
    };
    return map[mime] || "png";
}
/** Persist a data-URL image to disk and return a public `/uploads/...` path. */
async function persistDataUrlImage(dataUrl, folder = "gallery", preferredId) {
    const match = DATA_URL_RE.exec(dataUrl.trim());
    if (!match) {
        throw new Error("Invalid image data URL");
    }
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length) {
        throw new Error("Empty image data");
    }
    // Guard against runaway payloads (≈12MB decoded).
    if (buffer.length > 12 * 1024 * 1024) {
        throw new Error("Image is too large (max 12MB)");
    }
    const dir = path_1.default.join(UPLOAD_ROOT, folder);
    await promises_1.default.mkdir(dir, { recursive: true });
    const id = (preferredId || (0, crypto_1.randomUUID)()).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || (0, crypto_1.randomUUID)();
    const filename = `${id}-${Date.now()}.${extensionForMime(mime)}`;
    const absolute = path_1.default.join(dir, filename);
    await promises_1.default.writeFile(absolute, buffer);
    return `/uploads/${folder}/${filename}`;
}
function isDataUrlImage(value) {
    return DATA_URL_RE.test(String(value || "").trim());
}
