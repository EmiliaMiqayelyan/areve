'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@/i18n/I18nProvider';
import { hasArmenianScript } from '@/i18n/localeContent';
import { mergeSiteContentForLocale } from '@/i18n/mergeSiteContent';
import { getMessages } from '@/i18n/messages';
import type { Locale } from '@/i18n/types';
import { apiFetch } from '@/lib/api';
import type { PublicSettings, SiteContent } from '@/lib/siteContentDefaults';
import { SOCIAL_URLS } from '@/lib/socialDefaults';
import { STORE_PHONE_DISPLAY, STORE_TELEGRAM_URL, STORE_WHATSAPP_URL } from '@/lib/storeContact';

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

function looksCorrupted(value?: string | null): boolean {
  return Boolean(value && MOJIBAKE_RE.test(value));
}

function resolveFooterDescription(
  locale: Locale,
  value: string | undefined,
  fallback: string
): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed || looksCorrupted(trimmed)) return fallback;

  if (
    locale === 'hy' &&
    (trimmed.startsWith('Յուրաքանչյուր կտոր փոքրիկ արև է') ||
      trimmed.startsWith('Ստեղծված ձեռքերով'))
  ) {
    return fallback;
  }

  if (locale === 'en' && /Every piece is a tiny sun/i.test(trimmed)) {
    return fallback;
  }

  if (locale === 'hy') {
    return hasArmenianScript(trimmed) ? trimmed : fallback;
  }

  return !hasArmenianScript(trimmed) ? trimmed : fallback;
}

function buildSettings(locale: Locale, data?: Partial<PublicSettings> | null): PublicSettings {
  const m = getMessages(locale);
  const siteContent = mergeSiteContentForLocale(locale, data?.siteContent) as SiteContent;
  return {
    storeName: data?.storeName ?? 'AREVÉ',
    tagline:
      locale === 'hy'
        ? hasArmenianScript(data?.tagline) && !looksCorrupted(data?.tagline)
          ? data!.tagline!
          : m.settings.taglineHy
        : !hasArmenianScript(data?.tagline) && data?.tagline && !looksCorrupted(data.tagline)
          ? data.tagline
          : m.settings.taglineHy,
    footerDescription: resolveFooterDescription(
      locale,
      data?.footerDescription,
      m.settings.footerHy
    ),
    supportEmail: data?.supportEmail ?? '',
    businessPhone: STORE_PHONE_DISPLAY,
    address: data?.address ?? '',
    instagramUrl: data?.instagramUrl ?? SOCIAL_URLS.instagram,
    facebookUrl: data?.facebookUrl ?? SOCIAL_URLS.facebook,
    whatsappUrl: STORE_WHATSAPP_URL,
    telegramUrl: STORE_TELEGRAM_URL,
    tiktokUrl: data?.tiktokUrl ?? SOCIAL_URLS.tiktok,
    youtubeUrl: data?.youtubeUrl ?? SOCIAL_URLS.youtube,
    siteContent,
  };
}

type SiteSettingsContextValue = {
  settings: PublicSettings;
  loading: boolean;
  error: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();

  const { data: raw, isLoading: loading, isError: error } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch<Partial<PublicSettings>>('/settings'),
    staleTime: 120_000,
    gcTime: 300_000,
    retry: 1,
  });

  const settings = useMemo(() => buildSettings(locale, raw), [locale, raw]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      error,
    }),
    [settings, loading, error]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return ctx;
}
