import axios from './axios'
import type { Employee } from '@/types/employee'

export const getEmployees = (params?: { page?: number; limit?: number; search?: string }) => {
  return axios.get('/employees', { params })
}

export const getEmployeeById = (id: number) => {
  return axios.get(`/employees/${id}`)
}

export const createEmployee = (data: {
  name: string
  role: string
  phonenum?: string
  status: 'active' | 'inactive'
}) => {
  return axios.post('/employees', data)
}


export const updateEmployee = (id: number, data: Partial<Employee>) => {
  return axios.put(`/employees/${id}`, data)
}
