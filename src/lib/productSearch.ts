import type { Locale } from '@/i18n/types';
import { pickLocalized } from '@/lib/localizedText';
import type { Product } from '@/lib/store';

function normalize(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase().trim();
}

/** Case-insensitive match against product name (both locales) and its category label. */
export function matchesProductQuery(
  product: Product,
  query: string,
  locale: Locale,
  categoryLabel?: string
): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = [
    pickLocalized(product.name, locale),
    pickLocalized(product.name, locale === 'hy' ? 'en' : 'hy'),
    categoryLabel ?? '',
    product.category,
  ]
    .map((part) => normalize(String(part ?? '')))
    .join(' ');
  return q.split(/\s+/).every((term) => haystack.includes(term));
}
