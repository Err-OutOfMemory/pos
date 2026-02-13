<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { ref } from 'vue';

const auth = useAuthStore()
let name = auth.user?.name || 'Guest'
const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <h1>Welcome, Admin {{ name }}!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
