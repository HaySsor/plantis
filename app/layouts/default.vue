<script setup lang="ts">
import AppNavbar from "~/components/AppNavbar.vue";
</script>

<template>
  <div class="app-shell">
    <AppNavbar />
    <div class="content-wrapper">
      <NuxtPage />
    </div>
  </div>
</template>

<style lang="scss">
.app-shell {
  min-height: 100vh;
  padding: 1.25rem;
  padding-bottom: 7.2rem;

  @media (min-width: 1001px) {
    padding-bottom: 1.25rem;
  }
}

.content-wrapper {
  max-width: 1300px;
  margin: 1.6rem auto 0;
  width: 100%;
}

.content-wrapper :deep(main) {
  width: 100%;
}
</style>
