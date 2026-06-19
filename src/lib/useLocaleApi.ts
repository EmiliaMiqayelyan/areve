'use client';

import { useCallback } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { apiFetch } from './api';

export function useLocaleApiFetch() {
  const { locale } = useI18n();
  return useCallback(
    <T,>(path: string, options?: RequestInit, token?: string) =>
      apiFetch<T>(path, options, token, locale),
    [locale]
  );
}
