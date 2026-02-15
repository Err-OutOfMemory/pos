<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits(['changePage'])

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

// ฟังก์ชันเปลี่ยนหน้า
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('changePage', page)
  }
}

const from = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const to = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>

<template>
  <div class="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
    <div class="text-sm text-gray-500">
      แสดง <span class="font-medium text-gray-800">{{ from }}</span> ถึง
      <span class="font-medium text-gray-800">{{ to }}</span> จากทั้งหมด
      <span class="font-medium text-gray-800">{{ totalItems }}</span> รายการ
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :disabled="currentPage === page"
          class="min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition"
          :class="
            currentPage === page
              ? 'bg-[#8B735B] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          "
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
