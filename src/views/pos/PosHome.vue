<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import CartPanel from '@/components/pos/CartPanel.vue'
import ProductCard from '@/components/pos/ProductCard.vue'
import { Search, X } from 'lucide-vue-next'
import { getProducts } from '@/api/product.api'
import { getCategories } from '@/api/category.api'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { useCartStore } from '@/stores/cart.store'

const cart = useCartStore()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)

const addProduct = (product: Product) => {
  if (!product.id) return

  cart.addToCart({
    id: product.id,
    product_name: product.product_name,
    price: product.price,
    description: product.description,
    type: product.type,
    category_name: product.category?.category_name ?? '',
  })
}

const fetchCategories = async () => {
  const res = await getCategories({
    limit: 50,
    status: 'active',
  })
  categories.value = res.data.data
}

const clearSearch = () => {
  searchQuery.value = ''
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await getProducts({
      limit: 1000,
      search: searchQuery.value || undefined,
      category_id: selectedCategory.value || undefined,
    })

    products.value = res.data.data
  } finally {
    loading.value = false
  }
}

let timeout: any

watch([searchQuery, selectedCategory], () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    fetchProducts()
  }, 300)
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <!-- LEFT SIDE -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Search -->
      <div class="p-4 flex flex-col lg:flex-row gap-4">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="ค้นหาสินค้า..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#8b5b71] focus:outline-none transition"
          />
          <button
            v-if="searchQuery.length > 0"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="px-4">
        <div class="flex overflow-x-auto gap-2 pb-2 flex-1">
          <button
            @click="selectedCategory = null"
            class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition"
            :class="!selectedCategory ? 'bg-[#8B735B] text-white' : 'bg-gray-100 text-gray-600'"
          >
            ทั้งหมด
          </button>

          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition"
            :class="
              selectedCategory === cat.id ? 'bg-[#8B735B] text-white' : 'bg-gray-100 text-gray-600'
            "
          >
            {{ cat.category_name }}
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div v-if="loading" class="p-20 flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B735B]"></div>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          <ProductCard
            v-for="product in products"
            :key="product.id!"
            :product="product"
            @add="addProduct"
          />
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE -->
    <CartPanel />
  </div>
</template>
