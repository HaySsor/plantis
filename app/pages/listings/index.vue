<template>
  <main class="listings-page">
    <h1>Oferty roślin</h1>

    <ListingSearchBar @submit="onFilterSubmit" />

    <p class="filters-info">
      Aktywne filtry:
      <strong>{{ activeQuery || "brak frazy" }}</strong>
      /
      <strong>{{ activeLocation || "brak lokalizacji" }}</strong>
    </p>

    <NuxtLink to="/">Wróć na stronę główną</NuxtLink>
  </main>
</template>

<script setup lang="ts">
const activeQuery = ref("");
const activeLocation = ref("");

function onFilterSubmit(payload: { query: string; location: string }) {
  activeQuery.value = payload.query;
  activeLocation.value = payload.location;
}
</script>

<style scoped lang="scss">
.listings-page {
  padding: 2.4rem;
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  background: #ffffff;
  display: grid;
  gap: 1.6rem;
}

h1 {
  margin: 0 0 1rem;
  font-size: 3rem;
  color: var(--green-dark);
}

p {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-muted);
}

.filters-info {
  font-size: 1.7rem;
}

.filters-info strong {
  color: var(--green-dark);
}

a {
  display: inline-block;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--green-dark);
}
</style>
