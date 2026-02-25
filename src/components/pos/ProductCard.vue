<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types/product'
import ProductImage from '@/components/common/ProductImage.vue'

const props = defineProps<{
  product: Product
}>()

const isCoffee = computed(() => props.product.category?.category_name?.toLowerCase() === 'coffee')

const selectedSugar = ref<number | null>(null)

const sugarLevel = {
  0: '0%',
  1: '50%',
  2: '100%',
  3: '200%',
}

const emit = defineEmits<{
  (e: 'add', product: Product): void
  (e: 'selectSugar', product: Product, sugarLevel: number): void
}>()
</script>

<template>
  <div class="relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md h-full flex flex-col">
    <span
      v-if="isCoffee"
      class="absolute z-10 top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full"
    >
      {{ product.type }}
    </span>

    <div class="h-50 rounded-lg mb-3 overflow-hidden">
      <ProductImage :src="product.img_path" />
    </div>
    <div class="flex justify-between">
      <h3 class="font-semibold text-gray-800 truncate">
        {{ product.product_name }}
      </h3>

      <p class="text-lg text-gray-500 mt-1">{{ product.price.toLocaleString() }} ฿</p>
    </div>

    <div class="text-sm text-gray-400 mt-2 min-h-12">
      <div v-if="isCoffee" class="flex gap-2 flex-wrap">
        <button
          v-for="(lv, key) in sugarLevel"
          :key="key"
          @click.stop="selectedSugar = Number(key)"
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium transition border',
            selectedSugar === Number(key)
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100',
          ]"
        >
          {{ lv }}
        </button>
      </div>
    </div>

    <button
      class="mt-auto w-full bg-[#8B735B] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#724a51] transition"
      @click.stop="emit('add', product)"
    >
      เพิ่มลงตะกร้า
    </button>
  </div>
</template>
