<template>
  <div class="admin-dashboard">
    <h1>Panel Administratora</h1>
    <p class="admin-info">
      Witaj w panelu zarządzania platformą <strong>Plantis</strong>.<br />
      Tutaj będziesz mógł akceptować ogłoszenia, zarządzać użytkownikami i treścią serwisu.
    </p>
    <div class="admin-placeholder">
      <Icon name="mdi:hammer-wrench" class="placeholder-icon" />
      <span>Sekcje w budowie</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});
</script>

<style lang="scss" scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  font-family: var(--font-title);
  font-size: 3rem;
  color: #1a2e20;
  margin: 0;
}

.admin-info {
  font-size: 1.6rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 60rem;
  margin: 0;
}

.admin-placeholder {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 6rem 2rem;
  border: 2px dashed var(--border-soft);
  border-radius: 2rem;
  color: var(--text-muted);
  max-width: 50rem;

  span {
    font-size: 1.6rem;
    font-weight: 500;
  }
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.4;
}
</style>
