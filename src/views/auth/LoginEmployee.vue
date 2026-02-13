<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { checkUser } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import Swal from 'sweetalert2'
import CoffeeLoader from '@/components/common/CoffeeLoader.vue'
import Numpad from '@/components/common/Numpad.vue'

const employeeCode = ref('')
const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// ========================
// NUMPAD HANDLERS
// ========================

const onDigit = (digit: string) => {
  if (isLoading.value) return
  employeeCode.value += digit
}

const onDelete = () => {
  if (isLoading.value) return
  employeeCode.value = employeeCode.value.slice(0, -1)
}

const onEnter = () => {
  submit()
}
const submit = async () => {
  if (!employeeCode.value.trim()) {
    Swal.fire({
      title: 'กรุณากรอกรหัสพนักงาน',
      icon: 'warning',
      confirmButtonText: 'ตกลง',
    })
    return
  }
  isLoading.value = true
  await sleep(2000)

  try {
    const { data } = await checkUser(`E${employeeCode.value.trim()}`)

    authStore.setTempUser(data)

    if (data.is_first_login) {
      router.replace('/login/register-pin')
    } else {
      router.replace('/login/pin')
    }
  } catch (err: any) {
    console.error(err)
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่พบรหัสพนักงาน',
      icon: 'error',
    })
  } finally {
    isLoading.value = false
    employeeCode.value = ''
  }
}
</script>

<template>
  <CoffeeLoader :show="isLoading" />
  <div class="space-y-6">
    <h2 class="text-4xl font-bold text-center text-slate-800">POS SYSTEM</h2>
    <div class="relative w-full text-2xl">
      <!-- icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
        />
      </svg>
      <span
        class="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none"
      >
        E
      </span>
      <!-- input -->
      <input
        v-model="employeeCode"
        inputmode="none"
        class="w-full pl-16 pr-4 py-3 border rounded-lg"
        :class="employeeCode ? 'border-indigo-500 ring-2' : 'border-gray-300'"
      />
    </div>

    <div class="flex items-center justify-center gap-3">
      <!-- NUMPAD -->
      <Numpad @digit="onDigit" @delete="onDelete" @enter="onEnter" />
    </div>
  </div>
</template>
