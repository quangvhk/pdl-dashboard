import { create } from 'zustand'
import type { AuthUser } from '@/types'

interface AuthState {
  // State
  user: AuthUser | null
  isInitialized: boolean

  // Computed
  isAuthenticated: boolean

  // Actions
  login: (user: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  setInitialized: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  isInitialized: false,

  // Computed
  get isAuthenticated() {
    return !!get().user
  },

  // Actions
  login: (user) => {
    set({ user })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: () => {
    set({ user: null })
  },

  setInitialized: (value) => {
    set({ isInitialized: value })
  },
}))
