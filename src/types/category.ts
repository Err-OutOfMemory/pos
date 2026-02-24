export interface Category {
  id: number
  category_name: string
  status: boolean
  created_at?: string
  updated_at?: string
}

export interface CategoryResponse {
  data: Category[]
  total: number
  page: number
  limit: number
  total_page: number
}
