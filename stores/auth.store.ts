import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser, AuthResponse } from '@/types'

interface AuthState {
  // State
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isInitialized: boolean

  // Computed
  isAuthenticated: boolean

  // Actions
  login: (response: AuthResponse) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  setInitialized: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      user: null,
      isInitialized: false,

      // Computed
      get isAuthenticated() {
        return !!get().accessToken && !!get().user
      },

      // Actions
      login: (response) => {
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        })
        // Set auth cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-status=authenticated; path=/; max-age=604800; SameSite=Lax'
        }
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken })
      },

      setUser: (user) => {
        set({ user })
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        })
        // Clear auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-status=; path=/; max-age=0'
        }
      },

      setInitialized: (value) => {
        set({ isInitialized: value })
      },
    }),
    {
      name: 'pandalang-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist refresh token and user — access token stays in memory only
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)
