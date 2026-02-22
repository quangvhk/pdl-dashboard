'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { ApiError } from '@/lib/api/client'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache is kept for 10 minutes after last subscriber unmounts
        gcTime: 10 * 60 * 1000,
        // Don't retry on client errors (4xx)
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false
          return failureCount < 3
        },
        // Refetch on window focus (user returns to tab)
        refetchOnWindowFocus: true,
        // Refetch on reconnect
        refetchOnReconnect: 'always',
      },
      mutations: {
        // Global mutation error handler (fallback — per-mutation toasts take precedence)
        onError: (error) => {
          if (error instanceof ApiError) {
            console.error('Mutation error:', error.message)
          }
        },
      },
    },
  })
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
