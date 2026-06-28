'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { hasArmenianScript } from '@/i18n/localeContent';
import { mergeSiteContentForLocale } from '@/i18n/mergeSiteContent';
import { getMessages } from '@/i18n/messages';
import type { Locale } from '@/i18n/types';
import { apiFetch } from '@/lib/api';
import type { PublicSettings, SiteContent } from '@/lib/siteContentDefaults';
import { SOCIAL_URLS } from '@/lib/socialDefaults';

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

function looksCorrupted(value?: string | null): boolean {
  return Boolean(value && MOJIBAKE_RE.test(value));
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
    footerDescription:
      locale === 'hy'
        ? hasArmenianScript(data?.footerDescription) && !looksCorrupted(data?.footerDescription)
          ? data!.footerDescription!
          : m.settings.footerHy
        : !hasArmenianScript(data?.footerDescription) &&
            data?.footerDescription &&
            !looksCorrupted(data.footerDescription)
          ? data.footerDescription
          : m.settings.footerHy,
    supportEmail: data?.supportEmail ?? '',
    businessPhone: data?.businessPhone ?? '',
    address: data?.address ?? '',
    instagramUrl: data?.instagramUrl ?? SOCIAL_URLS.instagram,
    facebookUrl: data?.facebookUrl ?? SOCIAL_URLS.facebook,
    whatsappUrl: data?.whatsappUrl ?? 'https://wa.me/37441832122',
    telegramUrl: data?.telegramUrl ?? '',
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
  const [raw, setRaw] = useState<Partial<PublicSettings> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    void apiFetch<PublicSettings>('/settings')
      .then((data) => {
        setRaw(data);
        setError(false);
      })
      .catch(() => {
        setRaw(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

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
