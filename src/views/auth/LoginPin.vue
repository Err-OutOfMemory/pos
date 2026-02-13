<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import Numpad from '@/components/common/Numpad.vue'
import Swal from 'sweetalert2'
import CoffeeLoader from '@/components/common/CoffeeLoader.vue'

const router = useRouter()
const auth = useAuthStore()

const length = 6
const pin = ref<string[]>(Array(length).fill(''))
const currentIndex = ref(0)
const isLoading = ref(false)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ========================
// NUMPAD HANDLERS
// ========================

const onDigit = (digit: string) => {
  if (currentIndex.value >= length || isLoading.value) return

  pin.value[currentIndex.value] = digit
  currentIndex.value++
}

const onDelete = () => {
  if (currentIndex.value === 0 || isLoading.value) return

  currentIndex.value--
  pin.value[currentIndex.value] = ''
}

const resetPin = () => {
  pin.value = Array(length).fill('')
  currentIndex.value = 0
}

// ========================
// AUTO SUBMIT
// ========================

watch(
  () => pin.value.join(''),
  async (val) => {
    if (val.length === length) {
      await submit()
    }
  },
)

// ========================
// LOGIN
// ========================

const submit = async () => {
  const pinVal = pin.value.join('')
  if (pinVal.length !== length) return

  if (!auth.employeeCode) {
    router.replace('/login')
    return
  }

  try {
    isLoading.value = true
    await sleep(2000)

    const { data } = await login(auth.employeeCode, pinVal)

    auth.setAuth(data.token, data.user)
    router.replace('/pos')
  } catch (err) {
    resetPin()
    Swal.fire({
      title: 'Login Failed',
      text: 'Incorrect PIN. Please try again.',
      icon: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- LOADING -->
  <CoffeeLoader :show="isLoading" />
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-center text-slate-800">Enter PIN</h2>
    <!-- PIN DISPLAY -->
    <div class="flex items-center justify-center gap-3">
      <div
        v-for="(digit, index) in pin"
        :key="index"
        class="w-14 h-14 flex items-center justify-center rounded-lg border-2 text-2xl font-bold transition"
        :class="digit ? 'border-indigo-500' : 'border-gray-300'"
      >
        <span v-if="digit">●</span>
      </div>
    </div>
    <div class="flex items-center justify-center gap-3">
      <!-- NUMPAD -->
      <Numpad @digit="onDigit" @delete="onDelete" @enter="submit" />
    </div>
  </div>
</template>
