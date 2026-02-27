export interface OrderType {
  id: number
  type: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface OrderDetail {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  discount_amount: number
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: number
  date: string
  order_type_id: number
  total_amount: number
  discount: number
  employee_id: number
  status: string
  created_at?: string
  updated_at?: string
}

export interface CreateOrderItemRequest {
  product_id: number
  quantity: number
  price: number
  discount_amount?: number
  description?: string
}

export interface CreateOrderRequest {
  emp_id: number | null
  order_type_id: number
  discount?: number
  total_price: number
  items: CreateOrderItemRequest[]
}
