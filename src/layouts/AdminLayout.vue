<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Coffee } from 'lucide-vue-next'

const route = useRoute()

const menus = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Employees', path: '/admin/employees' },
  { name: 'Products', path: '/admin/products' },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen bg-[#F9F8F6]">
    <!-- SIDEBAR -->
    <aside class="fixed top-0 left-0 w-64 h-screen border-r shadow-sm" style="background-color: #EFE9E3">
      <div class="p-4 border-b flex items-center gap-3">
        <div class="bg-white p-2 rounded-lg">
          <Coffee class="h-5 w-5" style="color: #FA86C4" />
        </div>

        <div>
          <h1 class="text-lg font-bold text-gray-800">Admin POS</h1>
          <p class="text-xs text-gray-500">Management Panel</p>
        </div>
      </div>

      <nav class="p-4 space-y-2">
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
    </aside>

    <!-- RIGHT SIDE -->
    <div class="ml-64 flex flex-col min-h-screen">
      <!-- CONTENT -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
