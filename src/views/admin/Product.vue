<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Plus, Search, X, Edit2, Trash2 } from 'lucide-vue-next'
import {
  getProducts,
  uploadImage,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/product.api'
import { getCategories, createCategory, updateCategory } from '@/api/category.api'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import Pagination from '@/components/common/Pagination.vue'
import ProductImage from '@/components/common/ProductImage.vue'
import ProductModal from '@/components/admin/ProductModal.vue'
import CategoryModal from '@/components/admin/CategoryModal.vue'
import Swal from 'sweetalert2'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentProduct = ref<Product | null>(null)

const activeCategoryMenu = ref<number | null>(null)
const isCategoryModalOpen = ref(false)
const isCategoryEditMode = ref(false)
const currentCategory = ref<Category | null>(null)

const openAddModal = () => {
  isEditMode.value = false
  currentProduct.value = null
  isModalOpen.value = true
}

const openEditModal = (product: Product) => {
  isEditMode.value = true
  currentProduct.value = { ...product }
  isModalOpen.value = true
}

const openEditCategory = (category: Category) => {
  isCategoryEditMode.value = true
  currentCategory.value = category
  isCategoryModalOpen.value = true
  activeCategoryMenu.value = null
}

const openCategoryModal = () => {
  isCategoryEditMode.value = false
  currentCategory.value = null
  isCategoryModalOpen.value = true
}

const handleSave = async (payload: any) => {
  loading.value = true
  try {
    let finalImgPath = payload.img_path

    if (payload.imageFile) {
      const uploadRes = await uploadImage(payload.imageFile)
      finalImgPath = uploadRes.data.url
    }

    const productData = {
      product_name: payload.product_name,
      category_id: payload.category_id,
      price: payload.price,
      type: payload.type,
      description: payload.description,
      status: payload.status,
      img_path: finalImgPath,
    }

    if (isEditMode.value && currentProduct.value?.id) {
      await updateProduct(currentProduct.value.id, productData)
    } else {
      await createProduct(productData)
    }

    isModalOpen.value = false
    await Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
      timer: 1500,
      showConfirmButton: false,
    })

    fetchProducts()
  } catch (err: any) {
    console.error(err)
    Swal.fire('ผิดพลาด', err.response?.data?.error || 'ไม่สามารถบันทึกข้อมูลได้', 'error')
  } finally {
    loading.value = false
  }
}

const handleSaveCategory = async (payload: any) => {
  loading.value = true

  try {
    if (isCategoryEditMode.value && payload.id) {
      await updateCategory(payload.id, {
        category_name: payload.category_name,
      })
    } else {
      await createCategory({
        category_name: payload.category_name,
      })
    }

    isCategoryModalOpen.value = false
    await Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: 'บันทึกข้อมูลหมวดหมู่เรียบร้อยแล้ว',
      timer: 1500,
      showConfirmButton: false,
    })

    fetchCategories()
  } catch (err: any) {
    console.error(err)
    Swal.fire('ผิดพลาด', err.response?.data?.error || 'ไม่สามารถบันทึกข้อมูลได้', 'error')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (productId: number) => {
  const result = await Swal.fire({
    title: 'ลบสินค้า?',
    text: 'คุณต้องการลบสินค้านี้ใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f07c7c',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'ลบสินค้า',
    cancelButtonText: 'ยกเลิก',
  })

  if (!result.isConfirmed) return

  try {
    await deleteProduct(productId)
    Swal.fire({
      title: 'สำเร็จ',
      text: 'ลบสินค้ารายการนี้เรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
    fetchProducts()
  } catch (err) {
    console.error(err)
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถลบสินค้าได้',
      icon: 'error',
    })
  }
}

const fetchCategories = async () => {
  try {
    const res = await getCategories({ limit: 50, status: 'active' })
    categories.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch categories')
  }
}

const fetchProducts = async () => {
  loading.value = true
  await sleep(300)

  try {
    const res = await getProducts({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchQuery.value,
      category_id: selectedCategory.value || undefined,
    })
    products.value = res.data.data
    pagination.value.total = res.data.total
  } finally {
    loading.value = false
  }
}
const resetFilter = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  pagination.value.page = 1
  fetchProducts()
}

watch(selectedCategory, () => {
  fetchProducts()
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">จัดการสินค้า</h1>
        <p class="text-sm text-gray-500">เพิ่ม แก้ไข และจัดการรายการอาหาร/เครื่องดื่ม</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center justify-center gap-2 bg-[#8B735B] text-white px-4 py-2 rounded-lg hover:bg-[#725e4a] transition shadow-sm"
      >
        <Plus class="h-4 w-4" /> เพิ่มสินค้าใหม่
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="relative w-full lg:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาสินค้า..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9B59C]/50"
            @keyup.enter="fetchProducts"
          />

          <button
            v-if="searchQuery"
            @click="resetFilter"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide flex-1">
          <button
            @click="selectedCategory = null"
            class="shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all"
            :class="
              !selectedCategory
                ? 'bg-[#8B735B] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
          >
            ทั้งหมด
          </button>

          <div v-for="cat in categories" :key="cat.id" class="relative shrink-0 group">
            <!-- CHIP -->
            <button
              @click="selectedCategory = cat.id"
              class="px-6 py-2 rounded-full text-sm font-medium transition-all border"
              :class="
                selectedCategory === cat.id
                  ? 'bg-[#8B735B] text-white border-[#8B735B] shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#C9B59C]'
              "
            >
              {{ cat.category_name }}
            </button>
            <!-- EDIT ICON -->
            <button
              v-if="selectedCategory === cat.id"
              @click.stop="openEditCategory(cat)"
              class="absolute -top-1 -right-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
            >
              <Edit2 class="w-3 h-3 text-gray-600" />
            </button>
          </div>

          <button
            @click="openCategoryModal"
            class="shrink-0 p-2 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#8B735B] hover:text-[#8B735B] transition-all ml-2"
            title="เพิ่มหมวดหมู่ใหม่"
          >
            <Plus class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-20 flex justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B735B]"></div>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#F9F8F6] text-gray-600 text-lg uppercase">
            <th class="px-6 py-4 font-semibold">สินค้า</th>
            <th class="px-6 py-4 font-semibold">หมวดหมู่</th>
            <th class="px-6 py-4 font-semibold">ราคา</th>
            <th class="px-6 py-4 font-semibold">ประเภท</th>
            <th class="px-6 py-4 font-semibold">สถานะ</th>
            <th class="px-6 py-4 font-semibold text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="product in products" :key="product.id!" class="hover:bg-gray-50/50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <ProductImage :src="product.img_path" />

                <div>
                  <div class="font-bold text-gray-800">{{ product.product_name }}</div>
                  <div class="text-sm text-gray-400 truncate max-w-50">
                    {{ product.description || 'ไม่มีคำอธิบาย' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-sm font-medium uppercase"
              >
                {{ product.category?.category_name || 'ทั่วไป' }}
              </span>
            </td>
            <td class="px-6 py-4 font-semibold text-gray-700">
              ฿{{ product.price.toLocaleString() }}
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600">{{ product.type }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium"
                :class="
                  product.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="product.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ product.status === 'active' ? 'พร้อมขาย' : 'ระงับ' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  @click="openEditModal(product)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition"
                >
                  <Edit2 class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(product.id!)"
                  class="p-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && products.length === 0" class="p-20 text-center text-gray-500">
        <div class="mb-2">ไม่พบรายการสินค้า</div>
        <button @click="resetFilter" class="text-[#8B735B] text-sm underline">ล้างการค้นหา</button>
      </div>
    </div>

    <Pagination
      v-if="!loading && products.length > 0"
      :current-page="pagination.page"
      :total-items="pagination.total"
      :items-per-page="pagination.limit"
      @change-page="
        (p) => {
          pagination.page = p
          fetchProducts()
        }
      "
    />
  </div>
  <ProductModal
    :show="isModalOpen"
    :is-edit="isEditMode"
    :initial-data="currentProduct"
    :categories="categories"
    @close="isModalOpen = false"
    @save="handleSave"
  />

  <CategoryModal
    :show="isCategoryModalOpen"
    :is-edit="isCategoryEditMode"
    :initial-data="currentCategory"
    @close="isCategoryModalOpen = false"
    @save="handleSaveCategory"
  />
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
