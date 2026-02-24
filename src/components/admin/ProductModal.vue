<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Upload, Loader2 } from 'lucide-vue-next'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'

const props = defineProps<{
  show: boolean
  isEdit: boolean
  initialData: Product | null
  categories: Category[]
}>()

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const imagePreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  id: null as number | null,
  product_name: '',
  category_id: null as number | null,
  description: '',
  type: 'Iced',
  price: 0,
  img_path: '',
  status: 'active',
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        form.value = { ...props.initialData }
        imagePreview.value = props.initialData.img_path
      } else {
        resetForm()
      }
    }
  },
)

const resetForm = () => {
  form.value = {
    id: null,
    product_name: '',
    category_id: props.categories[0]?.id || null,
    description: '',
    type: 'Iced',
    price: 0,
    img_path: '',
    status: 'active',
  }
  imagePreview.value = null
  selectedFile.value = null
}

const handleImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  loading.value = true
  setTimeout(() => {
    emit('save', {
      ...form.value,
      imageFile: selectedFile.value,
    })
    loading.value = false
  }, 500)
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div class="px-6 py-4 border-b flex justify-between items-center bg-[#F9F8F6]">
        <h3 class="font-bold text-gray-800 text-lg">
          {{ isEdit ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition">
          <X class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">รูปภาพสินค้า</label>
            <div
            @click="fileInput?.click()"
              class="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#8B735B] transition cursor-pointer overflow-hidden group"
            >
              <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                <Upload class="h-10 w-10 mb-2" />
                <span class="text-xs">คลิกเพื่ออัปโหลดรูปภาพ</span>
              </div>
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
              >
                <span class="text-white text-sm font-medium">เปลี่ยนรูปภาพ</span>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="handleImageChange"
            />
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อสินค้า</label>
              <input
                v-model="form.product_name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
                placeholder="เช่น Espresso..."
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">หมวดหมู่</label>
              <select
                v-model="form.category_id"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.category_name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ราคา (฿)</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ประเภท</label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
                >
                  <option value="Hot">ร้อน</option>
                  <option value="Iced">เย็น</option>
                  <option value="Frappe">ปั่น</option>
                  <option value="Unit">ชิ้น / หน่วย</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">คำอธิบาย</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C9B59C]/50 outline-none"
            placeholder="รายละเอียดเพิ่มเติม..."
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">สถานะ</label>
          <div class="flex gap-4 mt-1">
            <label
              v-for="s in ['active', 'inactive']"
              :key="s"
              class="flex items-center gap-2 cursor-pointer group"
            >
              <input type="radio" v-model="form.status" :value="s" class="hidden peer" />
              <div
                class="px-4 py-2 rounded-lg border transition-all text-sm peer-checked:bg-[#8B735B] peer-checked:text-white peer-checked:border-[#8B735B]"
              >
                {{ s === 'active' ? 'พร้อมขาย' : 'ระงับการขาย' }}
              </div>
            </label>
          </div>
        </div>
      </form>

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
