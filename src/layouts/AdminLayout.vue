<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Coffee, LogOut, UserCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const userName = auth.user?.name || 'Guest'
const userRole = auth.user?.role || 'Staff'

const menus = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Employees', path: '/admin/employees' },
  { name: 'Products', path: '/admin/products' },
]

const isActive = (path: string) => {
  return route.path === path
}

const logout = async () => {
  const result = await Swal.fire({
    title: 'ออกจากระบบ?',
    text: 'คุณต้องการออกจากระบบใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f07c7c',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
  })

  if (!result.isConfirmed) return

  try {
    auth.logout()
    router.replace('/login')
  } catch (err: any) {
    console.error(err)
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถออกจากระบบได้',
      icon: 'error',
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F9F8F6]">
    <!-- SIDEBAR -->
    <aside
      class="fixed top-0 left-0 w-64 h-screen border-r shadow-sm flex flex-col"
      style="background-color: #efe9e3"
    >
      <!-- HEADER -->
      <div class="h-16 p-4 border-b flex items-center gap-3">
        <div class="bg-white p-2 rounded-lg">
          <Coffee class="h-5 w-5" style="color: #fa86c4" />
        </div>

        <div>
          <h1 class="text-lg font-bold text-gray-800">Admin POS</h1>
          <p class="text-xs text-gray-500">Management Panel</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="flex items-center px-4 py-2 rounded-lg transition"
          :class="
            isActive(menu.path) ? 'bg-[#C9B59C] text-white' : 'text-gray-700 hover:bg-gray-100'
          "
        >
          <span class="font-medium">
            {{ menu.name }}
          </span>
        </RouterLink>
      </nav>

      <div class="p-4">
        <button
          class="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-[#f07c7c] text-white hover:opacity-90 transition"
          v-on:click="logout"
        >
          <LogOut class="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>

    <!-- RIGHT SIDE -->
    <div class="ml-64 flex flex-col min-h-screen">
      <header
        class="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10"
      >
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {{ menus.find((m) => isActive(m.path))?.name || 'Management' }}
        </h2>

        <div class="flex items-center gap-4">
          <button
            @click="router.push('/pos')"
            class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b5b71] text-white text-sm font-medium hover:bg-[#724a51] transition shadow-sm"
          >
            <Coffee class="h-4 w-4" />
            Go POS
          </button>

          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-gray-800 leading-none">{{ userName }}</p>
            <span
              class="uppercase mt-1 inline-flex items-center rounded-md bg-green-400/10 px-1 py-1 text-[10px] text-gray-800 inset-ring inset-ring-green-500/20"
              >{{ userRole }}</span
            >
          </div>
          <div class="bg-[#efe9e3] p-1.5 rounded-full border border-[#C9B59C]">
            <UserCircle class="h-6 w-6 text-[#8B735B]" />
          </div>
        </div>
      </header>
      <!-- CONTENT -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
