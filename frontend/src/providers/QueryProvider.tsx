'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

/**
 * QueryProvider - React Query provider with optimal cache settings
 *
 * Cache Strategy:
 * - staleTime: 30 seconds - data is considered fresh for 30s
 * - gcTime: 5 minutes - unused data is garbage collected after 5 min
 * - refetchOnWindowFocus: false - don't refetch just because window gained focus
 * - retry: 1 - retry failed requests once
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is fresh for 30 seconds
            staleTime: 30 * 1000,
            // Garbage collect after 5 minutes
            gcTime: 5 * 60 * 1000,
            // Don't refetch on window focus (user can manually refresh)
            refetchOnWindowFocus: false,
            // Only retry once on failure
            retry: 1,
            // Retry with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Don't retry mutations
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
