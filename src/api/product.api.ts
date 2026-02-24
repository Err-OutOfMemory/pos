import axios from './axios'
import type { Product } from '@/types/product'

export const getProducts = (params: {
  page?: number
  limit?: number
  category_id?: number
  search?: string
}) => {
  return axios.get('/products', { params })
}

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const createProduct = (data: Partial<Product>) => {
  return axios.post('/products', data)
}

export const updateProduct = (id: number, data: Partial<Product>) => {
  return axios.put(`/products/${id}`, data)
}
