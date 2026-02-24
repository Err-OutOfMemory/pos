export interface Product {
  id: number | null
  product_name: string
  category_id: number | null
  description: string
  type: string
  price: number
  img_path: string
  status: string
  category?: {
    id: number
    category_name: string
    status: boolean
  }
  created_at?: string
  updated_at?: string
}

export const defaultProduct: Product = {
  id: null,
  product_name: '',
  category_id: null,
  description: '',
  type: 'Iced',
  price: 0,
  img_path: '',
  status: 'active',
}

export interface ProductResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  total_page: number
}
