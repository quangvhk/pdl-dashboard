'use client'

import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { AuthInitializer } from './auth-initializer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthInitializer>{children}</AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  )
}
