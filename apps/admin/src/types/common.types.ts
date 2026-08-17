export interface PaginationMeta {
  page: number
  perPage: number
  totalPage: number
  totalData?: number
  count?: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string
  data: T
  metadata?: PaginationMeta
  meta?: PaginationMeta
}

export interface ApiPaginatedResponse<T = unknown> {
  statusCode?: number
  message?: string
  data: T[]
  metadata: PaginationMeta
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  error?: string
  errors?: Record<string, string[]>
}

export type SortOrder = "asc" | "desc"

export interface BaseQueryParams {
  page?: number | string
  perPage?: number | string
  search?: string
  orderBy?: string
  orderDirection?: SortOrder
  status?: string
}
