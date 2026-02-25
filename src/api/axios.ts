import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const auth = useAuthStore()

    if (error.response?.status === 401) {
      auth.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default instance
