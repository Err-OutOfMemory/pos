<script setup lang="ts">
import { ref } from 'vue'
import SkeletonLoad from '@/components/common/SkeletonLoad.vue'

defineProps<{
  src?: string | null
}>()

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
  <div class="relative h-12 w-12">
    <!-- Skeleton -->
    <SkeletonLoad v-if="loading" width="48px" height="48px" rounded="rounded-lg" />

    <!-- Image -->
    <img
      v-show="!loading && !error"
      :src="src || 'https://placehold.co/400'"
      @load="onLoad"
      @error="onError"
      class="h-12 w-12 rounded-lg object-cover border border-gray-100"
      alt="product"
    />

    <!-- Fallback -->
    <div
      v-if="error"
      class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 border"
    >
      No Image
    </div>
  </div>
</template>
