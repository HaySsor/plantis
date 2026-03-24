<template>
  <section class="cities-section">
    <h2 class="cities-title">Szukaj w swoim mieście</h2>
    <div class="cities-grid">
      <NuxtLink
        v-for="city in cities"
        :key="city.name"
        :to="`/listings?city=${city.name}`"
        class="city-chip"
      >
        <Icon name="mdi:map-marker-outline" class="city-icon" />
        {{ city.name }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const cities = [
  { name: "Warszawa" },
  { name: "Kraków" },
  { name: "Wrocław" },
  { name: "Gdańsk" },
  { name: "Poznań" },
  { name: "Łódź" },
  { name: "Katowice" },
  { name: "Lublin" },
];
</script>

<style lang="scss" scoped>
.cities-section {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.cities-title {
  font-size: 2.4rem;
  font-family: var(--font-title);
  color: var(--green-dark);
  text-align: center;
  margin: 0;
}

.cities-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}

.city-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  border: 2px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: none;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;

  &:hover {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }
}

.city-icon {
  font-size: 1.6rem;
  color: var(--green-main);
}
</style>
