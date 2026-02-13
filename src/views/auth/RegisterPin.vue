<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { registerPin } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import Numpad from '@/components/common/Numpad.vue'
import Swal from 'sweetalert2'

const LENGTH = 6

const router = useRouter()
const auth = useAuthStore()

// PIN STATE
const pin = ref<string[]>(Array(LENGTH).fill(''))
const confirmPin = ref<string[]>(Array(LENGTH).fill(''))

const currentIndex = ref(0)
const step = ref<'pin' | 'confirm'>('pin')
const isLoading = ref(false)

onMounted(() => {
  if (!auth.employeeCode) {
    router.replace('/login')
  }
})

const activeArray = computed(() => (step.value === 'pin' ? pin.value : confirmPin.value))

const onDigit = (digit: string) => {
  if (currentIndex.value >= LENGTH || isLoading.value) return

  activeArray.value[currentIndex.value] = digit
  currentIndex.value++
}

const onDelete = () => {
  if (currentIndex.value === 0 || isLoading.value) return

  currentIndex.value--
  activeArray.value[currentIndex.value] = ''
}

const resetCurrent = () => {
  activeArray.value.fill('')
  currentIndex.value = 0
}

const nextStep = () => {
  if (currentIndex.value < LENGTH) return

  step.value = 'confirm'
  currentIndex.value = 0
}

const submit = async () => {
  if (pin.value.join('') !== confirmPin.value.join('')) {
    Swal.fire({
      title: 'PIN not match',
      icon: 'error',
    })
    step.value = 'pin'
    resetCurrent()
    confirmPin.value.fill('')
    return
  }

  try {
    isLoading.value = true
    console.log('Registering PIN:', pin.value.join(''))
    const { data } = await registerPin(auth.employeeId!, pin.value.join(''))

    auth.setAuth(data.token, data.role)
    auth.clearTempUser()

    router.replace('/pos')
  } catch (err: any) {
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.error || 'Something went wrong',
      icon: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6 text-center">
    <h2 class="text-2xl font-bold">
      {{ step === 'pin' ? 'Create PIN' : 'Confirm PIN' }}
    </h2>

    <!-- PIN DISPLAY -->
    <div class="flex justify-center gap-3">
      <div
        v-for="(digit, index) in activeArray"
        :key="index"
        class="w-14 h-14 flex items-center justify-center rounded-lg border-2 text-2xl font-bold transition"
        :class="digit ? 'border-indigo-500' : 'border-gray-300'"
      >
        <span v-if="digit">●</span>
      </div>
    </div>

    <!-- NUMPAD -->
    <div class="flex items-center justify-center gap-3">
      <Numpad @digit="onDigit" @delete="onDelete" @enter="step === 'pin' ? nextStep() : submit()" />
    </div>
  </div>
</template>
