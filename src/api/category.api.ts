import axios from './axios'

export const getCategories = (params?: {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
}) => {
  return axios.get('/categories', { params })
}