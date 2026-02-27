import { defineStore } from 'pinia'

export type CartItem = {
  id: number
  product_name: string
  price: number
  qty: number
  description?: string
  type: string
  category_name: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalAmount: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  },

  actions: {
    addToCart(product: { id: number; product_name: string; price: number; description?: string; type : string  ; category_name: string }) {
      const existing = this.items.find(
        (i) => i.id === product.id && i.description === product.description,
      )

      if (existing) {
        existing.qty++
      } else {
        this.items.push({
          ...product,
          qty: 1,
        })
      }
    },

    increaseQty(id: number, description?: string) {
      const item = this.items.find((i) => i.id === id && i.description === description)
      if (item) item.qty++
    },

    decreaseQty(id: number, description?: string) {
      const item = this.items.find((i) => i.id === id && i.description === description)
      if (!item) return

      if (item.qty > 1) {
        item.qty--
      } else {
        this.items = this.items.filter((i) => i.id !== id || i.description !== description)
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
