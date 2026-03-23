<template>
  <Transition name="loader-fade">
    <div v-if="show" class="loader-overlay">
      <div class="loader-content">
        <Lottie
          link="/Loading.json"
          background-color="transparent"
          :width="220"
          :height="220"
          :loop="true"
          :autoplay="true"
          :speed="1.5"
        />
        <span class="loader-brand">Zielona Przesadzka</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
</script>

<style lang="scss" scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: #f9f6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.loader-brand {
  font-family: var(--font-title);
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--green-dark);
  letter-spacing: 0.02em;
  animation: fade-up 0.6s 0.3s ease both;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-fade-leave-active {
  transition: opacity 0.4s ease 0.2s;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
