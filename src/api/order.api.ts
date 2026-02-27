import axios from './axios'
import type { CreateOrderRequest } from '@/types/order'

export const getOrderTypes = () => {
  return axios.get('/order_types')
}

export const createOrder = (orderData: CreateOrderRequest) => {
  return axios.post('/orders', orderData)
}
