<script setup lang="ts">
import { useCartStore } from '@/stores/cart.store'

const cart = useCartStore()
</script>

<template>
  <div class="sticky w-100 bg-white rounded-xl shadow-sm border flex flex-col p-4">
    <h2 class="font-bold text-lg mb-4">🛒 Cart</h2>

    <div class="flex-1 overflow-y-auto space-y-3">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex justify-between items-center border-b pb-2"
      >
        <div>
          <p class="font-medium text-sm">{{ item.product_name }}</p>
          <p class="text-xs text-gray-500">{{ item.price }} x {{ item.qty }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="cart.decreaseQty(item.id)" class="w-6 h-6 bg-gray-200 rounded text-sm">
            -
          </button>
          <span class="text-sm">{{ item.qty }}</span>
          <button @click="cart.increaseQty(item.id)" class="w-6 h-6 bg-gray-200 rounded text-sm">
            +
          </button>
        </div>
      </div>

      <div v-if="cart.items.length === 0" class="text-sm text-gray-400">ยังไม่มีสินค้าในตะกร้า</div>
    </div>

    <div class="border-t pt-4 mt-4">
      <div class="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{{ cart.totalAmount }} ฿</span>
      </div>

      <button
        class="w-full mt-4 bg-[#8B735B] text-white py-3 rounded-xl font-medium hover:bg-[#725e4a] transition"
      >
        ชำระเงิน
      </button>
    </div>
  </div>
</template>
