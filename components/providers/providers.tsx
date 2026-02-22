'use client'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { AuthInitializer } from './auth-initializer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <ThemeProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ThemeProvider>
      </QueryProvider>
    </NuqsAdapter>
  )
}
