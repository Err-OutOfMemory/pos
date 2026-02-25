<script setup lang="ts">
import { ref } from 'vue'
import SkeletonLoad from '@/components/common/SkeletonLoad.vue'

defineProps<{
  src?: string | null
}>()

const getImageUrl = (path?: string | null) => {
  if (!path) return 'https://placehold.co/400'

  if (path.startsWith('http')) return path

  return `${import.meta.env.BASE_URL}${path}`
}
const loading = ref(true)
const error = ref(false)

const onLoad = () => {
  loading.value = false
}

const onError = () => {
  loading.value = false
  error.value = true
}
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Skeleton -->
    <SkeletonLoad v-if="loading" width="48px" height="48px" rounded="rounded-lg" />

    <!-- Image -->
    <img
      v-show="!loading && !error"
      :src="getImageUrl(src)"
      @load="onLoad"
      @error="onError"
      class="h-full w-full rounded-lg object-cover border border-gray-100"
      alt="product"
    />

    <!-- Fallback -->
    <div
      v-if="error"
      class="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 border"
    >
      No Image
    </div>
  </div>
</template>
