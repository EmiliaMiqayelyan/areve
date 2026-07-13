import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
const GALLERY_DIR = path.join(UPLOAD_ROOT, "gallery");

const DATA_URL_RE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/;

function extensionForMime(mime: string): string {
  const map: Record<string, string> = {
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
export async function persistDataUrlImage(
  dataUrl: string,
  folder: "gallery" | "products" = "gallery",
  preferredId?: string
): Promise<string> {
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

  const dir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(dir, { recursive: true });

  const id = (preferredId || randomUUID()).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || randomUUID();
  const filename = `${id}-${Date.now()}.${extensionForMime(mime)}`;
  const absolute = path.join(dir, filename);
  await fs.writeFile(absolute, buffer);

  return `/uploads/${folder}/${filename}`;
}

export function isDataUrlImage(value: string): boolean {
  return DATA_URL_RE.test(String(value || "").trim());
}

export { UPLOAD_ROOT, GALLERY_DIR };
