// API Client — placeholder for Task 2.2
// Full implementation: fetch wrapper with auth interceptors, tenant header injection, token refresh

/**
 * ApiError — stub for Task 2.2.
 * Full implementation will include status, code, details, and message parsing.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Singleton API client instance — full implementation in Task 2.2
export const apiClient = {} as {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>
  post: <T>(url: string, body?: unknown) => Promise<T>
  patch: <T>(url: string, body?: unknown) => Promise<T>
  delete: <T>(url: string) => Promise<T>
}
