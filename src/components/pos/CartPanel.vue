<script setup lang="ts">
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { ref, onMounted } from 'vue'
import { getOrderTypes, createOrder } from '@/api/order.api'
import type { OrderType } from '@/types/order'
import { NotebookText } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const cart = useCartStore()
const employee = useAuthStore()
const orderTypes = ref<OrderType[]>([])
const selectedOrderType = ref<number | null>(null)

const fetchOrderTypes = async () => {
  try {
    const res = await getOrderTypes()
    orderTypes.value = res.data
    selectedOrderType.value = orderTypes.value[0]?.id || null
  } catch (error) {
    orderTypes.value = []
    console.error('Fetch order types failed:', error)
  }
}

const submitOrder = async () => {
  if (!selectedOrderType.value) return

  const payload = {
    emp_id: employee.user?.employee_id || null,
    order_type_id: selectedOrderType.value,
    discount: 0,
    total_price: cart.totalAmount,
    items: cart.items.map((item) => ({
      product_id: item.id,
      quantity: item.qty,
      price: item.price,
      discount_amount: 0,
      description: item.description || '',
    })),
  }

  const res = await createOrder(payload)
  try {
    if (res.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'สร้างคำสั่งซื้อสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ',
        text: res.data?.message || 'โปรดลองอีกครั้ง',
      })
    }
  } finally {
    cart.clearCart()
  }
}

onMounted(() => {
  fetchOrderTypes()
})
</script>

<template>
  <div class="sticky w-100 bg-white rounded-xl shadow-sm border flex flex-col p-4">
    <h2 class="font-semibold text-2xl mb-4">Cart</h2>
    <div class="flex-1 overflow-y-auto space-y-3">
      <!-- Order Type Filter -->
      <div class="px-4 justify-center flex gap-6 mb-2">
        <button
          v-for="type in orderTypes"
          :key="type.id"
          @click="selectedOrderType = type.id"
          class="shrink-0 px-4 py-2 rounded-full font-medium transition"
          :class="
            selectedOrderType === type.id ? 'bg-[#8B735B] text-white' : 'bg-gray-100 text-gray-600'
          "
        >
          {{ type.type }}
        </button>
      </div>
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex justify-between items-center border-b pb-2"
      >
        <div>
          <p class="font-medium text-sm">
            <span v-if="item.category_name.toLowerCase() === 'coffee'"> {{ item.type }} </span>
            {{ item.product_name }}
          </p>
          <p class="text-xs text-gray-500">{{ item.price }} x {{ item.qty }}</p>
          <p v-if="item.description" class="text-xs text-gray-500 flex items-center gap-1">
            <NotebookText class="w-3 h-3" />
            {{ item.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="cart.decreaseQty(item.id, item.description)"
            class="w-6 h-6 bg-gray-200 rounded text-sm"
          >
            -
          </button>
          <span class="text-sm">{{ item.qty }}</span>
          <button
            @click="cart.increaseQty(item.id, item.description)"
            class="w-6 h-6 bg-gray-200 rounded text-sm"
          >
            +
          </button>
        </div>
      </div>

      <div v-if="cart.items.length === 0" class="text-sm text-gray-400 p-4">
        ยังไม่มีสินค้าในตะกร้า
      </div>
    </div>

    <div class="border-t pt-4 mt-4">
      <div class="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{{ cart.totalAmount }} ฿</span>
      </div>

      <button
        @click="submitOrder"
        class="w-full mt-4 bg-[#8B735B] text-white py-3 rounded-xl font-medium hover:bg-[#725e4a] transition"
      >
        ชำระเงิน
      </button>
    </div>
  </div>
</template>
