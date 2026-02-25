import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import LoginEmployee from '@/views/auth/LoginEmployee.vue'
import LoginPin from '@/views/auth/LoginPin.vue'
import RegisterPin from '@/views/auth/RegisterPin.vue'

import PosHome from '@/views/pos/PosHome.vue'

import Employee from '@/views/admin/Employee.vue'
import Product from '@/views/admin/Product.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ===== ROOT =====
    {
      path: '/',
      redirect: '/pos',
    },

    // ===== AUTH =====
    {
      path: '/login',
      component: AuthLayout,
      children: [
        { path: '', component: LoginEmployee },
        { path: 'pin', component: LoginPin },
        { path: 'register-pin', component: RegisterPin },
      ],
    },

    // ===== POS (PROTECTED) =====
    {
      path: '/pos',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: PosHome,
        },
      ],
    },

    // ===== ADMIN (PROTECTED) =====
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '/admin/employees', component: Employee },
        { path: '/admin/products', component: Product },
      ],
    },
  ],
})

/* ===== GLOBAL AUTH GUARD ===== */
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    const valid = await auth.validateToken()

    if (!valid) {
      return '/login'
    }
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return '/pos'
  }
})

export default router
