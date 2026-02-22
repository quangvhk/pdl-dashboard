/**
 * API Client — Task 2.2
 * Fetch wrapper with auth interceptors, tenant header injection, and token refresh.
 */

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: Array<{ field: string; message: string }>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

interface ApiClientConfig {
  baseUrl: string
  getAccessToken: () => string | null
  getTenantId: () => string | null
  onTokenRefresh: () => Promise<string | null>
  onAuthError: () => void
}

// ---------------------------------------------------------------------------
// ApiClient class
// ---------------------------------------------------------------------------

class ApiClient {
  private readonly baseUrl: string
  private readonly getAccessToken: () => string | null
  private readonly getTenantId: () => string | null
  private readonly onTokenRefresh: () => Promise<string | null>
  private readonly onAuthError: () => void

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl
    this.getAccessToken = config.getAccessToken
    this.getTenantId = config.getTenantId
    this.onTokenRefresh = config.onTokenRefresh
    this.onAuthError = config.onAuthError
  }

  // -------------------------------------------------------------------------
  // Core request method
  // -------------------------------------------------------------------------

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Inject auth token
    const token = this.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Inject tenant ID
    const tenantId = this.getTenantId()
    if (tenantId) {
      headers['x-tenant-id'] = tenantId
    }

    const fetchOptions: RequestInit = {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }

    let response = await fetch(url, fetchOptions)

    // Handle 401 — attempt token refresh once
    if (response.status === 401 && token) {
      const newToken = await this.onTokenRefresh()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, { ...fetchOptions, headers })
      } else {
        this.onAuthError()
        throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED')
      }
    }

    return this.handleResponse<T>(response)
  }

  // -------------------------------------------------------------------------
  // Response handler — unwraps the API envelope
  // -------------------------------------------------------------------------

  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle empty responses (e.g. 204 No Content)
    if (response.status === 204) {
      return undefined as T
    }

    let data: unknown
    try {
      data = await response.json()
    } catch {
      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}`, response.status)
      }
      return undefined as T
    }

    if (!response.ok) {
      const errData = data as {
        error?: { message?: string; code?: string; details?: Array<{ field: string; message: string }> }
      }
      throw new ApiError(
        errData.error?.message ?? 'Request failed',
        response.status,
        errData.error?.code,
        errData.error?.details,
      )
    }

    // Unwrap the envelope — return data.data directly
    const envelope = data as { data?: T }
    return envelope.data as T
  }

  // -------------------------------------------------------------------------
  // URL builder — appends query params
  // -------------------------------------------------------------------------

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
  ): string {
    const base = this.baseUrl.replace(/\/$/, '')
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${base}${path}`

    if (!params) return url

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value))
      }
    }

    const qs = searchParams.toString()
    return qs ? `${url}?${qs}` : url
  }

  // -------------------------------------------------------------------------
  // Convenience methods
  // -------------------------------------------------------------------------

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// ---------------------------------------------------------------------------
// Singleton instance
// Stores are imported lazily via getState() to avoid circular dependency issues
// while the stores themselves are still placeholders (Task 2.4).
// ---------------------------------------------------------------------------

function getAuthStore() {
  // Dynamic import avoids circular deps; falls back gracefully when store is a placeholder
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('@/stores/auth.store') as {
      useAuthStore: { getState: () => { accessToken?: string | null; refreshToken?: string | null; setTokens?: (a: string, r: string) => void; logout?: () => void } }
    }
    return useAuthStore?.getState?.() ?? {}
  } catch {
    return {}
  }
}

function getTenantStore() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useTenantStore } = require('@/stores/tenant.store') as {
      useTenantStore: { getState: () => { tenantId?: string | null } }
    }
    return useTenantStore?.getState?.() ?? {}
  } catch {
    return {}
  }
}

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',

  getAccessToken: () => {
    const state = getAuthStore()
    return state.accessToken ?? null
  },

  getTenantId: () => {
    const state = getTenantStore()
    return state.tenantId ?? null
  },

  onTokenRefresh: async () => {
    const state = getAuthStore()
    const refreshToken = state.refreshToken
    if (!refreshToken) return null

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/api/v1/auth/refresh`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        },
      )

      if (!response.ok) return null

      const data = (await response.json()) as { data?: { accessToken: string; refreshToken: string } }
      const tokens = data.data
      if (!tokens) return null

      const authState = getAuthStore()
      authState.setTokens?.(tokens.accessToken, tokens.refreshToken)
      return tokens.accessToken
    } catch {
      return null
    }
  },

  onAuthError: () => {
    const state = getAuthStore()
    state.logout?.()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },
})
