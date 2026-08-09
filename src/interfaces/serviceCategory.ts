export interface ServiceCategoryRecord {
  id: number
  hash_id?: string
  module_id: number
  icon: string
  title: string
  subtitle: string
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceCategoryPayload {
  module_id: number | null
  icon: string
  title: string
  subtitle: string
  sort_order: number | null
  active: boolean
}

export interface ServiceCategoryFilters {
  title: string | null
  module_id: number | null
  active: boolean | null
}

export interface TablePagination {
  page: number
  rowsPerPage: number
  rowsNumber: number
  sortBy?: string | null
  descending?: boolean
}

export interface ApiListResponse<T> {
  success: boolean
  data: {
    data: T[]
    current_page: number
    per_page: number
    total: number
  }
}

export interface ApiItemResponse<T> {
  success: boolean
  data: T
}
