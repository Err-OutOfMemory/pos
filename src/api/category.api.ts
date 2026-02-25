import axios from './axios'

export const getCategories = (params?: {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
}) => {
  return axios.get('/categories', { params })
}

export const getCategory = (id: number) => {
  return axios.get(`/categories/${id}`)
}

export const createCategory = (data: {
  category_name: string
}) => {
  return axios.post('/categories', data)
}

export const updateCategory = (id: number, data: {
  category_name: string
}) => {
  return axios.put(`/categories/${id}`, data)
}