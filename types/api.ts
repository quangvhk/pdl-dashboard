/** Standard success response envelope */
export interface ApiResponse<T> {
  success: true
  data: T
  meta: {
    timestamp: string
    requestId: string
  }
}

/** Paginated success response envelope */
export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    timestamp: string
    requestId: string
  }
}

/** Error response envelope */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
  meta: {
    timestamp: string
    requestId: string
  }
}

/** Pagination query params */
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
