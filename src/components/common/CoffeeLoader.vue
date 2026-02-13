<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="loader">
        <div class="container">
          <div class="coffee-header">
            <div class="coffee-header__buttons coffee-header__button-one"></div>
            <div class="coffee-header__buttons coffee-header__button-two"></div>
            <div class="coffee-header__display"></div>
            <div class="coffee-header__details"></div>
          </div>
          <div class="coffee-medium">
            <div class="coffe-medium__exit"></div>
            <div class="coffee-medium__arm"></div>
            <div class="coffee-medium__liquid"></div>
            <div class="coffee-medium__smoke coffee-medium__smoke-one"></div>
            <div class="coffee-medium__smoke coffee-medium__smoke-two"></div>
            <div class="coffee-medium__smoke coffee-medium__smoke-three"></div>
            <div class="coffee-medium__smoke coffee-medium__smoke-for"></div>
            <div class="coffee-medium__cup"></div>
          </div>
          <div class="coffee-footer"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
