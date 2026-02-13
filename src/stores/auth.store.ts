import { defineStore } from 'pinia'

export interface AuthUser {
  emp_code: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // ===== temp (before login) =====
    employeeId: null as number | null,
    employeeCode: null as string | null,
    isFirstLogin: false,

    // ===== auth (after login) =====
    token: localStorage.getItem('token') as string | null,
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user')!) as AuthUser)
      : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role,
  },

  actions: {
    setTempUser(payload: { employee_id: number; emp_code: string; is_first_login: boolean }) {
      this.employeeId = payload.employee_id
      this.employeeCode = payload.emp_code
      this.isFirstLogin = payload.is_first_login
    },

    clearTempUser() {
      this.employeeId = null
      this.employeeCode = null
      this.isFirstLogin = false
    },

    setAuth(token: string, user: AuthUser) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.clearTempUser()
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
