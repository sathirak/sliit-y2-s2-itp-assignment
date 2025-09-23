'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0, // Disable automatic polling by default
        dedupingInterval: 2000, // Dedupe requests within 2 seconds by default
        errorRetryCount: 3,
        errorRetryInterval: 5000, // Retry failed requests after 5 seconds
        onError: (error) => {
          // Global error handler
          console.error('SWR Error:', error);
          
          // You can add toast notifications here
          // toast.error('Something went wrong. Please try again.');
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Don't retry on 404 errors
          if (error.status === 404) return;
          
          // Don't retry on 403/401 errors (authentication issues)
          if (error.status === 403 || error.status === 401) return;
          
          // Only retry up to 3 times
          if (retryCount >= 3) return;
          
          // Retry after 5 seconds
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
