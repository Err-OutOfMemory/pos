<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'rounded-md',
})
</script>

<template>
  <div
    :class="['relative overflow-hidden bg-gray-200', rounded, $attrs.class]"
    :style="{ width, height }"
  >
    <!-- Shimmer Effect -->
    <div
      class="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer"
    ></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.4s infinite;
}
</style>
