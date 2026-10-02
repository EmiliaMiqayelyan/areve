import { ApiError, apiFetch } from './api';
import { parseLocalized, type LocalizedText } from './localizedText';
import { adminProductApiPath } from './resourceId';

const START = '\u2063';
const ZW0 = '\u200b';
const ZW1 = '\u200c';

type ProductImageFields = {
  image?: string;
  images?: string[] | null;
  description?: unknown;
  price?: number | string;
  name?: unknown;
};

type UpdateResponse = ProductImageFields & { product?: ProductImageFields };

export function encodeExtraImages(urls: string[]): string {
  const clean = urls.map((url) => url.trim()).filter((url) => url.startsWith('/')).slice(0, 3);
  if (!clean.length) return '';
  const bytes = new TextEncoder().encode(JSON.stringify(clean));
  let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  return START + [...bits].map((bit) => (bit === '1' ? ZW1 : ZW0)).join('');
}

export function decodeExtraImages(text: string): string[] {
  const start = text.indexOf(START);
  if (start < 0) return [];
  let bits = '';
  for (const ch of text.slice(start + START.length)) {
    if (ch === ZW1) bits += '1';
    else if (ch === ZW0) bits += '0';
    else break;
  }
  if (bits.length < 8 || bits.length % 8 !== 0) return [];
  const bytes = new Uint8Array(bits.length / 8);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(bits.slice(index * 8, index * 8 + 8), 2);
  }
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.startsWith('/')).slice(0, 3);
  } catch {
    return [];
  }
}

export function stripExtraImages(text: string): string {
  const start = text.indexOf(START);
  return (start < 0 ? text : text.slice(0, start)).trim();
}

export function readExtraImages(product: { images?: string[] | null; description?: unknown }): string[] {
  const direct = (product.images ?? []).map((src) => String(src).trim()).filter((src) => src.startsWith('/'));
  if (direct.length) return direct.slice(0, 3);

  const texts: string[] = [];
  if (typeof product.description === 'string') texts.push(product.description);
  else if (product.description && typeof product.description === 'object') {
    const record = product.description as { hy?: string; en?: string };
    texts.push(String(record.hy ?? ''), String(record.en ?? ''));
  }
  for (const text of texts) {
    const found = decodeExtraImages(text);
    if (found.length) return found;
  }
  return [];
}

export function embedExtraImages(description: unknown, urls: string[]): LocalizedText {
  const base = parseLocalized(description);
  const payload = encodeExtraImages(urls);
  return {
    hy: `${stripExtraImages(base.hy)}${payload}`,
    en: `${stripExtraImages(base.en)}${payload}`,
  };
}

function imagePathFromUpdate(result: UpdateResponse | null): string {
  const next = result?.product?.image || result?.image || '';
  return next.startsWith('/') && !next.startsWith('data:') ? next : '';
}

function sameImages(a: string[], b: string[]): boolean {
  return a.join('|') === b.join('|');
}

export async function storeExtraImages(options: {
  id: string;
  token: string;
  mainImage: string;
  previousImage: string;
  extras: string[];
  updates: Record<string, unknown>;
}): Promise<void> {
  const { id, token, mainImage, previousImage, extras, updates } = options;
  const path = adminProductApiPath(id);
  const wanted = extras.map((src) => src.trim()).filter(Boolean).slice(0, 3);
  const stored: string[] = [];
  let swapped = false;

  try {
    for (const src of wanted) {
      if (!src.startsWith('data:')) {
        stored.push(src);
        continue;
      }
      const result = await apiFetch<UpdateResponse>(
        path,
        { method: 'PUT', body: JSON.stringify({ image: src }) },
        token
      );
      const saved = imagePathFromUpdate(result);
      if (!saved) throw new ApiError('Could not save an additional photo');
      stored.push(saved);
      swapped = true;
    }

    const fresh = await apiFetch<ProductImageFields>(path, {}, token);
    const already = readExtraImages(fresh);
    const payload: Record<string, unknown> = {
      ...updates,
      image: mainImage,
      images: stored,
    };
    if (stored.length > 0 || already.length > 0) {
      payload.description = embedExtraImages(fresh.description, stored);
    }

    try {
      await apiFetch(path, { method: 'PUT', body: JSON.stringify(payload) }, token);
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 404) throw err;
      const row = await apiFetch<ProductImageFields>(path, {}, token);
      const imageOk = mainImage.startsWith('data:')
        ? Boolean(row.image && !row.image.startsWith('data:'))
        : row.image === mainImage;
      if (!imageOk || !sameImages(readExtraImages(row), stored)) throw err;
    }
  } catch (err) {
    if (swapped && previousImage && !previousImage.startsWith('data:')) {
      await apiFetch(path, { method: 'PUT', body: JSON.stringify({ image: previousImage }) }, token).catch(() => undefined);
    }
    throw err;
  }
}
