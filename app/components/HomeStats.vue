<template>
  <section class="stats-section">
    <div class="stat" v-for="stat in stats" :key="stat.label">
      <Icon :name="stat.icon" class="stat-icon" />
      <span class="stat-value">{{ stat.value }}</span>
      <span class="stat-label">{{ stat.label }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data } = await useFetch<{ listings: number; users: number; cities: number }>("/api/stats");

const stats = computed(() => [
  { icon: "mdi:flower-outline", value: data.value?.listings ?? 0, label: "ogłoszeń" },
  { icon: "mdi:account-group-outline", value: data.value?.users ?? 0, label: "użytkowników" },
  { icon: "mdi:map-marker-outline", value: data.value?.cities ?? 0, label: "miast" },
]);
</script>

<style lang="scss" scoped>
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 2rem;
  padding: 2.4rem 1.6rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.stat-icon {
  font-size: 2.8rem;
  color: var(--green-main);
  margin-bottom: 0.4rem;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  font-family: var(--font-title);
  color: var(--green-dark);
  line-height: 1;
}

.stat-label {
  font-size: 1.3rem;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
