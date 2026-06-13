export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
  status?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}
