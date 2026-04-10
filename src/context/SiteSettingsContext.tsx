'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import { DEFAULT_SITE_CONTENT, type PublicSettings, type SiteContent } from '@/lib/siteContentDefaults';

function fallbackPublicSettings(): PublicSettings {
  return {
    storeName: 'AREVÉ',
    tagline: 'Handcrafted · Unique · Made with Love',
    footerDescription: DEFAULT_SITE_CONTENT.metadata.description,
    supportEmail: '',
    businessPhone: '',
    address: '',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    whatsappUrl: 'https://wa.me/',
    tiktokUrl: '',
    youtubeUrl: '',
    siteContent: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) as SiteContent,
  };
}

type SiteSettingsContextValue = {
  settings: PublicSettings;
  loading: boolean;
  error: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(fallbackPublicSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    void apiFetch<PublicSettings>('/settings')
      .then((data) => {
        setSettings({
          ...data,
          siteContent: data.siteContent ?? (JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) as SiteContent),
        });
        setError(false);
      })
      .catch(() => {
        setError(true);
        setSettings(fallbackPublicSettings());
      })
      .finally(() => setLoading(false));
  }, []);

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
