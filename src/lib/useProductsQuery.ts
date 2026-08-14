'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/lib/store';

const STALE_MS = 60_000;

export function useProductsQuery(
  params?: {
    active?: boolean;
    favorite?: boolean;
    category?: string;
    excludeId?: string;
    limit?: number;
  },
  options?: { enabled?: boolean }
) {
  const { locale } = useI18n();

  const search = new URLSearchParams();
  if (params?.active) search.set('active', 'true');
  if (params?.favorite) search.set('favorite', 'true');
  if (params?.category && params.category !== 'all') search.set('category', params.category);
  if (params?.excludeId) search.set('excludeId', params.excludeId);
  if (params?.limit) search.set('limit', String(params.limit));

  const qs = search.toString();
  const path = qs ? `/products?${qs}` : '/products';

  return useQuery({
    queryKey: ['products', locale, params ?? {}],
    queryFn: () => apiFetch<Product[]>(path, {}, undefined, locale),
    staleTime: STALE_MS,
    gcTime: STALE_MS * 5,
    enabled: options?.enabled ?? true,
  });
}

export function useProductQuery(id: string) {
  const { locale } = useI18n();

  return useQuery({
    queryKey: ['product', locale, id],
    queryFn: () => apiFetch<Product>(`/products/${encodeURIComponent(id)}`, {}, undefined, locale),
    enabled: Boolean(id),
    staleTime: STALE_MS,
    gcTime: STALE_MS * 5,
  });
}

export function useCategoriesQuery() {
  const { locale } = useI18n();

  return useQuery({
    queryKey: ['categories', locale],
    queryFn: () => apiFetch<Array<{ id: string; name: string }>>('/categories', {}, undefined, locale),
    staleTime: STALE_MS * 5,
    gcTime: STALE_MS * 10,
  });
}

export function useGalleryQuery(limit?: number) {
  const { locale } = useI18n();

  const path = limit ? `/gallery?limit=${limit}` : '/gallery';

  return useQuery({
    queryKey: ['gallery', locale, limit ?? 'all'],
    queryFn: () =>
      apiFetch<Array<{ id?: string; src: string; alt: string; cols?: number }>>(path, {}, undefined, locale),
    staleTime: STALE_MS * 2,
    gcTime: STALE_MS * 10,
  });
}

export function useReviewsQuery() {
  const { locale } = useI18n();

  return useQuery({
    queryKey: ['reviews', locale],
    queryFn: () =>
      apiFetch<
        Array<{ id: string; name: string; location?: string; product?: string; comment: string; rating: number }>
      >('/reviews', {}, undefined, locale),
    staleTime: STALE_MS * 2,
    gcTime: STALE_MS * 10,
  });
}

export function useLocaleApiQuery() {
  const { locale } = useI18n();

  return useCallback(
    <T,>(path: string) => apiFetch<T>(path, {}, undefined, locale),
    [locale]
  );
}
