<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import type { Category } from '@/types/category'

const props = defineProps<{
  show: boolean
  isEdit: boolean
  initialData: Category | null
}>()

const emit = defineEmits(['close', 'save'])

const loading = ref(false)

const form = ref({
  id: null as number | null,
  category_name: '',
  status: 'active' as 'active' | 'inactive',
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      if (props.isEdit && props.initialData) {
        form.value = {
          id: props.initialData.id,
          category_name: props.initialData.category_name,
          status: props.initialData.status ? 'active' : 'inactive',
        }
      } else {
        resetForm()
      }
    }
  },
)

const resetForm = () => {
  form.value = {
    id: null,
    category_name: '',
    status: 'active',
  }
}

const handleSubmit = async () => {
  loading.value = true

  emit('save', {
    ...form.value,
  })

  setTimeout(() => {
    loading.value = false
  }, 400)
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center bg-[#F9F8F6]">
        <h3 class="font-bold text-gray-800 text-lg">
          {{ isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition">
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1"> ชื่อหมวดหมู่ </label>
          <input
            v-model="form.category_name"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
            placeholder="เช่น เครื่องดื่ม"
          />
        </div>
      </form>

      <!-- Footer -->
      <div class="px-6 py-4 border-t bg-gray-50 flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition font-medium"
        >
          ยกเลิก
        </button>

        <button
          @click="handleSubmit"
          :disabled="loading"
          class="flex-1 px-4 py-2.5 bg-[#8B735B] text-white rounded-xl hover:bg-[#725e4a] transition font-medium flex items-center justify-center gap-2"
        >
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
          {{ loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
        </button>
      </div>
    </div>
  </div>
</template>
