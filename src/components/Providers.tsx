'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { I18nProvider } from '@/i18n/I18nProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SiteSettingsProvider>{children}</SiteSettingsProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
