'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>{children}</SiteSettingsProvider>
    </QueryClientProvider>
  );
}
