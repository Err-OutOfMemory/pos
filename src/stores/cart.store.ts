import { defineStore } from 'pinia'
import type { Product } from '@/types/product'

export type CartItem = {
  id: number
  product_name: string
  price: number
  qty: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalAmount: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  },

  actions: {
    addToCart(product: { id: number; product_name: string; price: number }) {
      const existing = this.items.find((i) => i.id === product.id)

      if (existing) {
        existing.qty++
      } else {
        this.items.push({
          ...product,
          qty: 1,
        })
      }
    },

    increaseQty(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.qty++
    },

    decreaseQty(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return

      if (item.qty > 1) {
        item.qty--
      } else {
        this.items = this.items.filter((i) => i.id !== id)
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
