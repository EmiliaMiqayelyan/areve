'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { useState } from 'react';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { I18nProvider } from '@/i18n/I18nProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SiteSettingsProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </SiteSettingsProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
