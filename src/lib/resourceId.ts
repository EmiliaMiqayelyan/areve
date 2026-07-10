/** Normalize IDs from URLs, API params, and stored records. */
export function normalizeResourceId(id: string): string {
  const trimmed = String(id ?? '').trim();
  if (!trimmed) return '';
  try {
    return decodeURIComponent(trimmed).normalize('NFC');
  } catch {
    return trimmed.normalize('NFC');
  }
}

export function resourceIdsMatch(a: string, b: string): boolean {
  return normalizeResourceId(a) === normalizeResourceId(b);
}

/** Percent-encode a path segment (product id, category id, etc.). */
export function encodeResourceId(id: string): string {
  return encodeURIComponent(normalizeResourceId(id));
}

export function findByResourceId<T extends { id: string }>(
  items: T[],
  rawId: string | string[] | undefined
): T | undefined {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) return undefined;
  const normalized = normalizeResourceId(id);
  return items.find((item) => normalizeResourceId(item.id) === normalized);
}

export function adminProductEditPath(id: string): string {
  return `/admin/products/${encodeResourceId(id)}/edit`;
}

export function publicProductPath(id: string): string {
  return `/products/${encodeResourceId(id)}`;
}

/** Build `/admin/products/:id` style API paths with a safely encoded id. */
export function adminProductApiPath(id: string): string {
  return `/admin/products/${encodeResourceId(id)}`;
}

/** ASCII-safe product ids — supports Armenian titles without unicode slugs. */
export function createProductId(name: { hy?: string; en?: string }): string {
  const source = (name.en || name.hy || '').trim();
  const asciiSlug = source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);

  const suffix = Math.floor(Math.random() * 1000);
  if (asciiSlug.length >= 2) return `${asciiSlug}-${suffix}`;

  const unique =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `p-${unique}-${suffix}`;
}
