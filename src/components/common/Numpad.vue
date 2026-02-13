<script setup lang="ts">
import { CheckCircleIcon, Delete } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'digit', value: string): void
  (e: 'delete'): void
  (e: 'enter'): void
}>()

const layout = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'delete', '0', 'enter']
</script>

<template>
  <div class="grid grid-cols-3 gap-4 w-72">
    <button
      v-for="key in layout"
      :key="key"
      @click="
        key === 'delete' ? emit('delete') : key === 'enter' ? emit('enter') : emit('digit', key)
      "
      class="h-16 text-xl font-bold rounded-xl bg-gray-100 shadow active:scale-95 transition"
      :class="{
        'bg-red-200': key === 'delete',
        'bg-green-300': key === 'enter',
      }"
    >
      <span v-if="key === 'delete'">
        <Delete class="w-6 h-6 mx-auto" />
      </span>

      <span v-else-if="key === 'enter'">
        <CheckCircleIcon class="w-6 h-6 mx-auto" />
      </span>
      
      <span v-else>{{ key }}</span>
    </button>
  </div>
</template>
