/** Normalize a stored product/gallery image path into something an <img> can load. Returns '' when unusable. */
export function resolveProductImageSrc(image?: string | null): string {
  const src = String(image ?? '').trim();
  if (!src) return '';
  // Uploaded images are stored as /uploads/products/... paths; inline blobs are not durable.
  if (src.startsWith('blob:') || src.startsWith('data:image/')) return '';
  if (src.startsWith('/uploads/')) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}

/** Gallery entries can contain huge inline data URIs — keep only real file paths. */
export function isFileImage(src?: string | null): boolean {
  return resolveProductImageSrc(src) !== '';
}
