'use client';

import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { useCategoriesQuery, useProductsQuery } from '@/lib/useProductsQuery';
import type { Product } from '@/lib/store';

export type CatalogCategory = {
  id: string;
  label: string;
  count: number;
  cover?: Product;
};

/** id → localized category name, shared across cards via the react-query cache. */
export function useCategoryLabels(): Record<string, string> {
  const { locale } = useI18n();
  const { data: rows = [] } = useCategoriesQuery();
  return useMemo(() => {
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.id] = typeof row.name === 'string' ? row.name : pickLocalized(row.name, locale);
    }
    return map;
  }, [rows, locale]);
}

/** Categories that actually contain active products, with counts and a representative product photo. */
export function useCatalogCategories(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const labels = useCategoryLabels();
  const { data: rows = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: products = [], isLoading: productsLoading } = useProductsQuery(
    { active: true },
    { enabled }
  );

  const categories = useMemo<CatalogCategory[]>(() => {
    return rows
      .map((row) => {
        const inCategory = products.filter((p) => p.category === row.id && p.image);
        const cover = inCategory.find((p) => p.isFavorite) ?? inCategory[0];
        return { id: row.id, label: labels[row.id] ?? row.id, count: inCategory.length, cover };
      })
      .filter((c) => c.count > 0);
  }, [rows, products, labels]);

  return {
    categories,
    products,
    isLoading: categoriesLoading || productsLoading,
  };
}
